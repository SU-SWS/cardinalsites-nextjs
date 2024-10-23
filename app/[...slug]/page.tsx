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
// https://vercel.com/docs/functions/runtimes#max-duration
export const maxDuration = 60

const Page = async (props: PageProps) => {
  const params = await props.params
  const path = getPathFromContext(params.slug)
  const {redirect: redirectPath, entity} = await getEntityFromPath<NodeUnion>(path)

  if (redirectPath) redirect(redirectPath)
  if (!entity) notFound()

  return <NodePage node={entity} />
}

export const generateMetadata = async (props: PageProps): Promise<Metadata> => {
  const params = await props.params
  const path = getPathFromContext(params.slug)
  const {entity} = await getEntityFromPath<NodeUnion>(path)
  return entity ? getNodeMetadata(entity) : {}
}

export const generateStaticParams = async (): Promise<Array<{slug: string[]}>> => {
  const pagesToBuild = parseInt(process.env.BUILD_PAGES || "0")
  if (pagesToBuild === 0) return []
  const nodePaths = (await getAllNodes()).map(node => ({slug: node.path.split("/").filter(part => !!part)}))
  return pagesToBuild < 0 ? nodePaths : nodePaths.slice(0, pagesToBuild)
}

export default Page
