// Finds the pages that `next build` prerendered into `.next/server/app`, shared by the HTML and accessibility checks.
import {existsSync, readFileSync, readdirSync} from "node:fs"
import {join} from "node:path"

export const BUILD_DIR = ".next/server/app"

// Routes that redirect or 404 during prerendering aren't pages. Next writes them as an empty `__next_error__` shell, or
// as the layout with a redirect or not found fallback in place of the content when it happens inside a Suspense boundary.
const isErrorShell = file => {
  const html = readFileSync(file, "utf8")
  return html.includes('<html id="__next_error__"') || /NEXT_REDIRECT;|NEXT_HTTP_ERROR_FALLBACK;/.test(html)
}

// Fallback shells for dynamic params, ie `[[...slug]].html`. Their content, including the <title>, streams in at request time.
const isFallbackShell = file => file.includes("[")

/**
 * Absolute paths of the prerendered HTML files that are real pages.
 */
export const getPrerenderedFiles = () =>
  (existsSync(BUILD_DIR) ? readdirSync(BUILD_DIR, {recursive: true}) : [])
    .filter(file => file.endsWith(".html"))
    .map(file => join(BUILD_DIR, file))
    .filter(file => !isFallbackShell(file) && !isErrorShell(file))

/**
 * Url paths of the prerendered pages, ie `.next/server/app/news/story.html` => `/news/story`. Next's internal pages
 * like `_not-found` are left out since they don't have a url of their own.
 */
export const getPrerenderedRoutes = () =>
  getPrerenderedFiles()
    .map(
      file =>
        file
          .slice(BUILD_DIR.length)
          .replace(/\.html$/, "")
          .replace(/\/index$/, "") || "/"
    )
    .filter(route => !route.split("/").some(segment => segment.startsWith("_")))
    .sort()
