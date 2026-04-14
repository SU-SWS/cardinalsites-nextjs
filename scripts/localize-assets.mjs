#!/usr/bin/env node
/**
 * localize-assets.mjs
 *
 * Run after `yarn build` to download all remote images and documents
 * referenced in the static HTML export and rewrite those URLs to
 * relative paths so the site works without external dependencies.
 *
 * Usage:
 *   node scripts/localize-assets.mjs [options]
 *   yarn localize-assets
 *
 * Options:
 *   --out-dir=<dir>     Static export directory  (default: out)
 *   --assets=<subdir>   Asset subdirectory name  (default: assets)
 *   --concurrency=<n>   Parallel downloads       (default: 10)
 *   --dry-run           Print changes without writing any files
 *
 * Only assets hosted on the domain defined by NEXT_PUBLIC_DRUPAL_BASE_URL are
 * downloaded and rewritten. All other absolute URLs are left unchanged.
 * The variable is read from the process environment or from .env.local.
 */

import fs from "fs"
import fsp from "fs/promises"
import path from "path"
import https from "https"
import http from "http"
import {URL as NodeURL} from "url"

// ─── Configuration ────────────────────────────────────────────────────────────

const argv = process.argv.slice(2)
const opt = (name, def) => {
  const a = argv.find(s => s.startsWith(`--${name}=`))
  return a != null ? a.slice(name.length + 3) : def
}

const OUT_DIR = path.resolve(opt("out-dir", "out"))
const ASSETS_SUB = opt("assets", "assets")
const ASSETS_DIR = path.join(OUT_DIR, ASSETS_SUB)
const CONCURRENCY = parseInt(opt("concurrency", "10"), 10)
const DRY_RUN = argv.includes("--dry-run")

// ─── Drupal domain filter ─────────────────────────────────────────────────────

/**
 * Read a single env var from a .env-style file.
 * Only handles simple `KEY=value` lines; no variable expansion.
 */
function readEnvFile(filePath, key) {
  try {
    const lines = fs.readFileSync(filePath, "utf8").split("\n")
    for (const line of lines) {
      const trimmed = line.trim()
      if (trimmed.startsWith("#") || !trimmed.includes("=")) continue
      const [k, ...rest] = trimmed.split("=")
      if (k.trim() === key) return rest.join("=").trim()
    }
  } catch {}
  return undefined
}

const drupalBaseUrl =
  process.env.NEXT_PUBLIC_DRUPAL_BASE_URL ??
  readEnvFile(path.resolve(".env.local"), "NEXT_PUBLIC_DRUPAL_BASE_URL") ??
  readEnvFile(path.resolve(".env"), "NEXT_PUBLIC_DRUPAL_BASE_URL")

if (!drupalBaseUrl) {
  console.error("❌ NEXT_PUBLIC_DRUPAL_BASE_URL is not set.")
  console.error("   Set it in your environment or in .env.local before running this script.")
  process.exit(1)
}

const DRUPAL_HOST = new NodeURL(drupalBaseUrl).hostname

// ─── Image style ─────────────────────────────────────────────────────────────

// Drupal image style to apply when a managed image URL has no style in its path.
// Image style URLs look like: /files/styles/{style}/public/{original-path}
const IMAGE_STYLE = "breakpoint_2xl_1x"
const IMAGE_EXTS_RE = /\.(jpg|jpeg|png|gif)(\?|$)/i

// ─── URL detection ────────────────────────────────────────────────────────────

// Matches absolute HTTP(S) URLs ending in an image or document extension,
// followed by an optional query string. HTML-encoded ampersands (&amp;) are
// intentionally allowed inside the query string portion.
const ASSET_EXTENSIONS = "jpg|jpeg|png|gif|webp|svg|txt|rtf|docx?|pptx?|xlsx?|pdf"
// The character group (?:[^"'<>\s\\]|\\[^"']) matches a URL character that is either:
//   - Not a quote, angle-bracket, whitespace, or backslash  (normal URL chars)
//   - OR a backslash followed by a non-quote char            (JS/JSON escape like \u0026)
// This stops the match before \" or \' so we never consume the JS escape character that
// closes a JSON string value — otherwise the replacement would break the script block.
const urlRe = () =>
  new RegExp(
    String.raw`https?://(?:[^"'<>\s\\]|\\[^"'])+\.(?:${ASSET_EXTENSIONS})(?:\?(?:[^"'<>\s\\]|\\[^"'])*)?`,
    "gi"
  )

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Decode HTML entities in a URL so it can be used in an HTTP request. */
function decodeHtmlEntities(str) {
  return str
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
}

/** Map a raw URL (as found in HTML) to a local file path under ASSETS_DIR. */
function urlToLocal(rawUrl) {
  const decoded = decodeHtmlEntities(rawUrl)
  const parsed = new NodeURL(decoded)
  // Strip query string; normalise Windows path separators just in case
  const cleanPathname = parsed.pathname.replace(/\\/g, "/")
  return path.join(ASSETS_DIR, parsed.hostname, cleanPathname)
}

/** Return the relative path from an HTML file's directory to a local asset. */
function relativeFrom(htmlFile, assetPath) {
  return path.relative(path.dirname(htmlFile), assetPath).replace(/\\/g, "/")
}

/**
 * If rawUrl is a Drupal-managed image without an image style, return the
 * equivalent URL with IMAGE_STYLE applied. The transformation finds the
 * last `/files/` segment in the path and inserts `styles/{style}/public/`
 * after it, matching Drupal's image style URL convention.
 * Non-image URLs and URLs that already include `/files/styles/` are returned
 * unchanged.
 */
function withImageStyle(rawUrl) {
  const decoded = decodeHtmlEntities(rawUrl)
  let parsed
  try {
    parsed = new NodeURL(decoded)
  } catch {
    return rawUrl
  }
  if (!IMAGE_EXTS_RE.test(parsed.pathname)) return rawUrl
  if (parsed.pathname.includes("/files/styles/")) return rawUrl

  const lastFilesIdx = parsed.pathname.lastIndexOf("/files/")
  if (lastFilesIdx === -1) return rawUrl

  const before = parsed.pathname.slice(0, lastFilesIdx)
  const after = parsed.pathname.slice(lastFilesIdx + "/files/".length)
  parsed.pathname = `${before}/files/styles/${IMAGE_STYLE}/public/${after}`
  return parsed.toString()
}

/** Download rawUrl to dest, following up to 5 redirects. */
function download(rawUrl, dest, hops = 0) {
  return new Promise((resolve, reject) => {
    if (hops > 5) return reject(new Error("Too many redirects"))

    const url = decodeHtmlEntities(rawUrl)
    const client = url.startsWith("https") ? https : http

    const req = client.get(url, {timeout: 30_000}, res => {
      // Follow redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.resume()
        return download(res.headers.location, dest, hops + 1).then(resolve, reject)
      }

      if (res.statusCode !== 200) {
        res.resume()
        return reject(new Error(`HTTP ${res.statusCode}`))
      }

      fs.mkdirSync(path.dirname(dest), {recursive: true})
      const tmp = `${dest}.download`
      const file = fs.createWriteStream(tmp)

      res.pipe(file)
      file.on("finish", () => {
        file.close()
        fs.renameSync(tmp, dest)
        resolve()
      })
      file.on("error", err => {
        try {
          fs.unlinkSync(tmp)
        } catch {}
        reject(err)
      })
    })

    req.on("error", reject)
    req.on("timeout", () => {
      req.destroy()
      reject(new Error("Request timed out"))
    })
  })
}

/** Recursively yield all file paths in dir. */
async function* walk(dir) {
  for (const entry of await fsp.readdir(dir, {withFileTypes: true})) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) yield* walk(full)
    else yield full
  }
}

/**
 * Run async task functions with at most `limit` running at once.
 * Errors inside tasks are caught and returned as { ok: false, error }.
 */
async function pool(tasks, limit) {
  const queue = [...tasks]
  const results = []

  async function worker() {
    while (queue.length) {
      const task = queue.shift()
      try {
        results.push({ok: true, value: await task()})
      } catch (err) {
        results.push({ok: false, error: err})
      }
    }
  }

  await Promise.all(Array.from({length: Math.min(limit, tasks.length)}, worker))
  return results
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  if (!fs.existsSync(OUT_DIR)) {
    console.error(`❌ Output directory not found: ${OUT_DIR}`)
    console.error("   Run `yarn build` first.")
    process.exit(1)
  }

  console.log(`📂 Out dir    : ${OUT_DIR}`)
  console.log(`📦 Assets dir : ${ASSETS_DIR}`)
  console.log(`🌐 Drupal host: ${DRUPAL_HOST}`)
  if (DRY_RUN) console.log("🔍 Dry run — no files will be written\n")

  // ── Step 1: Collect HTML files ──────────────────────────────────────────────
  const htmlFiles = []
  for await (const f of walk(OUT_DIR)) {
    if (f.endsWith(".html")) htmlFiles.push(f)
  }
  console.log(`🔎 Found ${htmlFiles.length} HTML files\n`)

  // ── Step 2: Scan for asset URLs ─────────────────────────────────────────────
  // rawUrl  →  local file path
  const urlToPath = new Map()
  // local file path  →  canonical rawUrl used for downloading
  const pathToUrl = new Map()

  for (const htmlFile of htmlFiles) {
    const content = await fsp.readFile(htmlFile, "utf8")
    for (const [match] of content.matchAll(urlRe())) {
      // Only track assets hosted on the configured Drupal domain
      const decoded = decodeHtmlEntities(match)
      if (new NodeURL(decoded).hostname !== DRUPAL_HOST) continue

      if (!urlToPath.has(match)) {
        // For images without a Drupal image style, request the styled version.
        const styledUrl = withImageStyle(match)
        const local = urlToLocal(styledUrl)
        urlToPath.set(match, local)
        // First URL for a given local path wins as the download source
        if (!pathToUrl.has(local)) pathToUrl.set(local, styledUrl)
      }
    }
  }

  console.log(`🖼  Found ${urlToPath.size} unique asset URLs across all pages`)

  // ── Step 3: Download missing assets ─────────────────────────────────────────
  const toDownload = []
  let cached = 0

  for (const [local, rawUrl] of pathToUrl) {
    if (fs.existsSync(local)) {
      cached++
    } else {
      toDownload.push({rawUrl, local})
    }
  }

  if (cached > 0) console.log(`✓  ${cached} already cached`)

  let succeeded = 0
  let failed = 0

  if (toDownload.length > 0) {
    console.log(`\n⬇️  Downloading ${toDownload.length} assets (concurrency: ${CONCURRENCY})...\n`)

    await pool(
      toDownload.map(({rawUrl, local}) => async () => {
        const display = path.relative(OUT_DIR, local)
        if (DRY_RUN) {
          console.log(`  [dry-run] ${decodeHtmlEntities(rawUrl)}`)
          return
        }
        try {
          await download(rawUrl, local)
          succeeded++
          process.stdout.write(`  ✓ [${succeeded + failed}/${toDownload.length}] ${display}\n`)
        } catch (err) {
          failed++
          process.stderr.write(
            `  ✗ [${succeeded + failed}/${toDownload.length}] FAILED ${decodeHtmlEntities(rawUrl)}\n    ${err.message}\n`
          )
        }
      }),
      CONCURRENCY
    )

    console.log(`\n  Downloaded: ${succeeded}  Failed: ${failed}`)
  } else {
    console.log("✅ All assets already downloaded")
  }

  // ── Step 4: Rewrite HTML files ───────────────────────────────────────────────
  console.log(`\n✏️  Rewriting HTML files...\n`)
  let updatedCount = 0

  for (const htmlFile of htmlFiles) {
    const content = await fsp.readFile(htmlFile, "utf8")

    const updated = content.replace(urlRe(), match => {
      const local = urlToPath.get(match)
      if (!local) return match

      // Only replace if the asset was actually downloaded (or in dry-run mode)
      if (!DRY_RUN && !fs.existsSync(local)) return match

      return relativeFrom(htmlFile, local)
    })

    if (updated !== content) {
      updatedCount++
      if (!DRY_RUN) await fsp.writeFile(htmlFile, updated, "utf8")
      console.log(`  ✓ ${path.relative(OUT_DIR, htmlFile)}`)
    }
  }

  console.log(
    `\n✅ Done! Rewrote ${updatedCount}/${htmlFiles.length} HTML files` +
      (DRY_RUN ? " (dry-run — nothing written)" : "")
  )

  if (failed > 0) {
    console.warn(`\n⚠️  ${failed} asset(s) failed to download and were left as absolute URLs.`)
    process.exitCode = 1
  }
}

main().catch(err => {
  console.error("\nFatal error:", err)
  process.exit(1)
})
