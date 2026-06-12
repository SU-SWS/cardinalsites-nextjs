import {MetadataRoute} from "next"
import {getAllNodes} from "@lib/gql/gql-queries"
import {cacheLife} from "next/dist/server/use-cache/cache-life"

const Sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  "use cache: remote"
  cacheLife("weeks")

  const nodes = await getAllNodes()
  const sitemap: MetadataRoute.Sitemap = []

  nodes.map(node =>
    sitemap.push({
      url: `${process.env.NEXT_PUBLIC_DOMAIN || ""}${node.path === "/home" ? "/" : node.path}`,
      lastModified: new Date(node.changed.time),
      priority: node.__typename === "NodeStanfordPage" ? 1 : 0.8,
      changeFrequency: node.__typename === "NodeStanfordPage" ? "weekly" : "monthly",
    })
  )

  return sitemap
}

export default Sitemap
