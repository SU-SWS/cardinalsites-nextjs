import type {NextConfig} from "next"
import {INFINITE_CACHE} from "next/dist/lib/constants"
import {vaultEnvVars} from "./vault-envars"

const drupalUrl = new URL(process.env.NEXT_PUBLIC_DRUPAL_BASE_URL as string)

module.exports = async (_phase: string) => {
  const nextConfig: NextConfig = {
    env: {...(await vaultEnvVars())},
    cacheComponents: true,
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
      dangerouslyAllowLocalIP: !process.env.VERCEL_ENV,
      remotePatterns: [
        {
          // Allow any stanford domain for images, but require https.
          protocol: "https",
          hostname: "**.stanford.edu",
        },
        {
          protocol: drupalUrl.protocol === "https:" ? "https" : "http",
          hostname: drupalUrl.hostname,
          pathname: "/sites/**",
          search: "",
        },
        {
          protocol: "https",
          hostname: "localist-images.azureedge.net",
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
          source: "/files/:site(\\w+)/:slug(.*[txt|rtf|doc|docx|ppt|pptx|xls|xlsx|pdf]$)",
          destination: `${drupalUrl.protocol}//${drupalUrl.hostname}/sites/:site/files/:slug`,
        },
      ]
    },
  }
  return nextConfig
}
