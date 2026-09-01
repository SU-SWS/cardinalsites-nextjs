import type {MetadataRoute} from "next"
import {buildHeaders} from "@lib/gql/gql-client"
import {buildUrl} from "@lib/utils/utils"
import {cacheLife} from "next/cache"

const CHANGE_FREQUENCIES = ["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"] as const

const getSitemapDocument = async (): Promise<string> => {
  "use cache: remote"
  cacheLife("weeks")

  const response = await fetch(buildUrl("/sitemap.xml"), {headers: buildHeaders({Accept: "application/xml"})})
  if (!response.ok) {
    throw new Error(`Drupal responded ${response.status} ${response.statusText} for /sitemap.xml`)
  }
  return await response.text()
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
  const document = await getSitemapDocument()

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
