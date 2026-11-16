import type {NextConfig} from "next"
import {INFINITE_CACHE} from "next/dist/lib/constants"
import {vaultEnvVars} from "./vault-envars"

const drupalUrl = new URL(process.env.NEXT_PUBLIC_DRUPAL_BASE_URL as string)

// Document types proxied from Drupal's public files directory by the `/files/` rewrite. Matching is
// case-insensitive, so `.PDF` is included.
const DOCUMENT_EXTENSIONS = ["txt", "rtf", "doc", "docx", "ppt", "pptx", "xls", "xlsx", "pdf"]
// A single path segment. Slashes and backslashes, including percent-encoded ones that the upstream
// server could decode into separators, are not allowed inside it.
const FILE_PATH_SEGMENT = "(?:(?!%2f|%5c)[^/\\\\])+"
// A directory segment, which can't be `.` or `..` (literal or percent-encoded). That keeps the rewritten
// path inside `/sites/[site]/files` rather than walking up to anything else on the Drupal host.
const FILE_PATH_DIRECTORY = `(?!(?:\\.|%2e){1,2}/)${FILE_PATH_SEGMENT}/`
// Any depth of directories, then a file name ending in one of the document extensions.
const DOCUMENT_FILE_PATH = `(?:${FILE_PATH_DIRECTORY})*${FILE_PATH_SEGMENT}\\.(?:${DOCUMENT_EXTENSIONS.join("|")})`

module.exports = async (_phase: string) => {
  const nextConfig: NextConfig = {
    env: {...(await vaultEnvVars())},
    cacheComponents: true,
    partialPrefetching: false,
    // Optional SAML packages: resolved with a runtime `require` instead of being bundled, so a
    // site that installs without the optionalDependencies still builds. @see lib/auth/optional-saml.ts
    serverExternalPackages: ["passport-saml", "xml-encryption", "@xmldom/xmldom"],
    cacheLife: {
      // Safety net for any `use cache` scope that doesn't name a profile.
      default: {
        stale: INFINITE_CACHE,
        revalidate: INFINITE_CACHE,
        expire: INFINITE_CACHE,
      },
    },
    typescript: {
      // Disable build errors since dev dependencies aren't loaded on prod. Rely on GitHub actions to throw any errors.
      ignoreBuildErrors: process.env.CI !== "true",
    },
    images: {
      minimumCacheTTL: 2678400,
      // Every width and quality is a separately billed transformation per source image. The defaults allow 15 widths
      // up to 3840px; these 7 still cover the smallest rendered image through a full-width banner on a 2x display.
      imageSizes: [256, 384],
      deviceSizes: [640, 828, 1200, 1920, 2560],
      qualities: [75],
      dangerouslyAllowLocalIP: !process.env.VERCEL_ENV,
      remotePatterns: [
        {
          // Only original files arrive here; image style derivatives carry an `?itok=` hash and are
          // rendered without the optimizer. @see components/elements/wysiwyg.tsx
          protocol: drupalUrl.protocol === "https:" ? "https" : "http",
          hostname: drupalUrl.hostname,
          pathname: "/sites/**",
          search: "",
        },
        {
          protocol: "https",
          hostname: "localist-images.azureedge.net",
          pathname: "/photos/**",
          search: "",
        },
      ],
    },
    logging: {
      fetches: {
        fullUrl: true,
      },
    },
    async redirects() {
      return [
        {
          source: "/wp-:path",
          destination: "/not-found",
          permanent: true,
        },
        {
          source: "/wp-:slug/:path*",
          destination: "/not-found",
          permanent: true,
        },
        {
          source: "/node/:slug",
          destination: process.env.NEXT_PUBLIC_DRUPAL_BASE_URL + "/node/:slug",
          permanent: true,
        },
        {
          source: "/saml/login",
          destination: process.env.NEXT_PUBLIC_DRUPAL_BASE_URL + "/user/login",
          permanent: true,
        },
      ]
    },
    async headers() {
      if (process.env.NEXT_PUBLIC_DOMAIN) {
        return []
      }
      return [
        {
          source: "/:path*",
          headers: [
            {
              key: "X-Robots-Tag",
              value: "noindex,nofollow,noarchive",
            },
          ],
        },
      ]
    },
    async rewrites() {
      // Rewrite document urls so the user doesn't change domains. They will stay on the FE.
      return [
        {
          source: `/files/:site(\\w+)/:slug(${DOCUMENT_FILE_PATH})`,
          destination: `${drupalUrl.protocol}//${drupalUrl.hostname}/sites/:site/files/:slug`,
        },
      ]
    },
  }
  return nextConfig
}
