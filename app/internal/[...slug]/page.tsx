import NodePage from "@components/nodes/pages/node-page"
import {NodeUnion} from "@lib/gql/__generated__/drupal.d"
import {getAllNodes, getEntityFromPath} from "@lib/gql/gql-queries"
import {notFound, redirect} from "next/navigation"
import {getPathFromContext, PageProps, Slug} from "@lib/utils/utils"

// https://vercel.com/docs/functions/runtimes#max-duration
export const maxDuration = 60

const Page = async (props: PageProps) => {
  "use cache"

  const params = await props.params
  const path = getPathFromContext(params.slug)

  const {redirect: redirectPath, entity} = await getEntityFromPath<NodeUnion>(`/internal/${path}`)

  if (redirectPath) redirect(redirectPath)
  if (!entity) notFound()

  return <NodePage node={entity} />
}

export const generateStaticParams = async (): Promise<Array<Slug>> => {
  const pagesToBuild = parseInt(process.env.BUILD_PAGES || "0")
  if (pagesToBuild === 0) return []
  const paths = (await getAllNodes()).map(node => node.path).filter(path => !!path) as Array<string>
  const nodePaths = paths.map(path => ({slug: path.split("/").filter(part => !!part)}))
  return pagesToBuild < 0 ? nodePaths : nodePaths.slice(0, pagesToBuild)
}

export default Page
