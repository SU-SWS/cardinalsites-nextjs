import NodePage from "@components/nodes/pages/node-page"
import {NodeUnion} from "@lib/gql/__generated__/graphql"
import {getAllNodes, getEntityFromPath, getHomePagePath} from "@lib/gql/gql-queries"
import {notFound, redirect} from "next/navigation"
import {getPathFromContext, PageProps, Slug} from "@lib/utils/utils"

// Vercel max execution. See https://vercel.com/docs/functions/configuring-functions/duration
export const maxDuration = 30

const Page = async (props: PageProps) => {
  "use cache: remote"

  const params = await props.params
  const path = getPathFromContext(params.slug || "/")
  const homePath = await getHomePagePath()
  if (path === homePath) redirect("/")

  const {redirect: redirectPath, entity} = await getEntityFromPath<NodeUnion>(path)

  if (redirectPath) redirect(redirectPath)
  if (!entity) notFound()

  return <NodePage node={entity} isHome={path === "/"} />
}

export const generateStaticParams = async (): Promise<Array<Slug>> => {
  const pagesToBuild = parseInt(process.env.BUILD_PAGES || "0")
  if (pagesToBuild === 0) return [{slug: ["home"]}]

  const paths = (await getAllNodes())
    .map(node => node.path)
    .filter(path => !path?.startsWith("/internal")) as Array<string>

  const nodePaths = paths.map(path => ({slug: path.split("/").filter(part => !!part)}))
  nodePaths.push({slug: ["home"]})
  return pagesToBuild < 0 ? nodePaths : nodePaths.slice(0, pagesToBuild)
}

export default Page
