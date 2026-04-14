import type {MetadataRoute} from "next"
import {buildHeaders} from "@lib/gql/gql-client"
import {buildUrl} from "@lib/utils/utils"

// Required so the sitemap is emitted as a file during the static export.
export const dynamic = "force-static"

const CHANGE_FREQUENCIES = ["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"] as const

/**
 * Fetch Drupal's sitemap.xml. The sitemap is normally publicly available, so try it anonymously
 * first and only fall back to the authenticated request when the anonymous one is rejected. The
 * error is thrown rather than swallowed here so the caller decides how to handle a failure.
 */
const getSitemapDocument = async (): Promise<string> => {
  const headers = buildHeaders({Accept: "application/xml"})
  // Keep any infrastructure headers (WAF bypass) but drop the credentials for the first attempt.
  const anonymousHeaders = new Headers(headers)
  anonymousHeaders.delete("Authorization")

  const attempts = headers.has("Authorization") ? [anonymousHeaders, headers] : [anonymousHeaders]

  let lastError = ""
  for (const requestHeaders of attempts) {
    try {
      const response = await fetch(buildUrl("/sitemap.xml"), {headers: requestHeaders})
      if (response.ok) return await response.text()
      lastError = `Drupal responded ${response.status} ${response.statusText}`
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error)
    }
  }

  throw new Error(`Unable to fetch /sitemap.xml: ${lastError}`)
}

const tagValue = (xml: string, tag: string): string | undefined =>
  xml.match(new RegExp(`<${tag}>([^<]*)</${tag}>`))?.[1].trim() || undefined

/**
 * Drupal writes its own base url into every <loc>. Swap it for the front end domain, keeping the
 * path, query and fragment intact. Without NEXT_PUBLIC_DOMAIN the backend url is used as is, since
 * a sitemap requires absolute urls.
 */
const toPublicUrl = (loc: string): string => {
  const domain = process.env.NEXT_PUBLIC_DOMAIN
  if (!domain) return loc

  try {
    const {pathname, search, hash} = new URL(loc)
    return new URL(`${pathname}${search}${hash}`, domain).href
  } catch {
    return loc
  }
}

const Sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  let document = ""
  try {
    document = await getSitemapDocument()
  } catch (error) {
    // An unavailable backend sitemap shouldn't break the route: serve an empty sitemap instead.
    console.warn(error instanceof Error ? error.message : error)
  }

  return (document.match(/<url>[\s\S]*?<\/url>/g) ?? []).flatMap(entry => {
    const loc = tagValue(entry, "loc")
    if (!loc) return []

    const priority = Number(tagValue(entry, "priority"))

    return [
      {
        url: toPublicUrl(loc),
        lastModified: tagValue(entry, "lastmod"),
        changeFrequency: CHANGE_FREQUENCIES.find(frequency => frequency === tagValue(entry, "changefreq")),
        priority: Number.isFinite(priority) ? priority : undefined,
      },
    ]
  })
}

export default Sitemap
