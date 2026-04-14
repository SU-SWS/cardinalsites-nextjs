import type {NextConfig} from "next"
import {INFINITE_CACHE} from "next/dist/lib/constants"
import {vaultEnvVars} from "./vault-envars"

const drupalUrl = new URL(process.env.NEXT_PUBLIC_DRUPAL_BASE_URL as string)
const devMode = process.env.NODE_ENV === "development"

module.exports = async (_phase: string) => {
  const nextConfig: NextConfig = {
    output: !devMode ? "export" : undefined,
    env: {...(await vaultEnvVars())},
    cacheLife: {
      default: {
        stale: undefined,
        revalidate: INFINITE_CACHE,
        expire: INFINITE_CACHE,
      },
    },
    typescript: {
      // Disable build errors since dev dependencies aren't loaded on prod. Rely on GitHub actions to throw any errors.
      ignoreBuildErrors: process.env.CI !== "true",
    },
    images: {
      unoptimized: true,
      minimumCacheTTL: 2678400,
      dangerouslyAllowLocalIP: true,
      remotePatterns: [
        {
          // Allow any stanford domain for images, but require https.
          protocol: "https",
          hostname: "**.stanford.edu",
        },
        {
          protocol: drupalUrl.protocol === "https:" ? "https" : "http",
          hostname: drupalUrl.hostname,
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
  }
  return nextConfig
}
