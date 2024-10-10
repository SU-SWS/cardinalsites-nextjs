import {MetadataRoute} from "next"
import {getAllNodes} from "@lib/gql/gql-queries"

// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
export const revalidate = 604800
export const dynamic = "force-static"

const Sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const nodes = await getAllNodes()
  const sitemap: MetadataRoute.Sitemap = []

  nodes.map(node =>
    sitemap.push({
      url: `${process.env.NEXT_PUBLIC_DOMAIN || ""}${node.path}`,
      lastModified: new Date(node.changed.time),
      priority: node.__typename === "NodeStanfordPage" ? 1 : 0.8,
      changeFrequency: node.__typename === "NodeStanfordPage" ? "weekly" : "monthly",
    })
  )

  return sitemap
}

export default Sitemap
