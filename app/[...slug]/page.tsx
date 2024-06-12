import NodePage from "@components/nodes/pages/node-page"
import {Metadata} from "next"
import {NodeUnion} from "@lib/gql/__generated__/drupal.d"
import {getAllNodes, getEntityFromPath} from "@lib/gql/gql-queries"
import {getNodeMetadata} from "./metadata"
import {notFound, redirect} from "next/navigation"
import {getPathFromContext, PageProps} from "@lib/drupal/utils"

// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
export const revalidate = false
export const dynamic = "force-static"

const Page = async ({params}: PageProps) => {
  const path = getPathFromContext({params})
  const {redirect: redirectPath, entity, error} = await getEntityFromPath<NodeUnion>(path)

  if (error) throw error
  if (redirectPath?.url) redirect(redirectPath.url)
  if (!entity) notFound()

  return <NodePage node={entity} />
}

export const generateMetadata = async ({params}: PageProps): Promise<Metadata> => {
  const path = getPathFromContext({params})
  const {entity} = await getEntityFromPath<NodeUnion>(path)
  return entity ? getNodeMetadata(entity) : {}
}

export const generateStaticParams = async (): Promise<PageProps["params"][]> => {
  if (process.env.BUILD_COMPLETE !== "true") return []
  const nodes = await getAllNodes()
  return nodes.map(node => ({slug: node.path.split("/").filter(part => !!part)}))
}

export default Page
