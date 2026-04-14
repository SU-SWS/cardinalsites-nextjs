import NodePage, {NodePageSkeleton} from "@components/nodes/pages/node-page"
import {NodeUnion} from "@lib/gql/__generated__/graphql"
import {getAllNodes, getAllRedirectPaths, getEntityFromPath, getHomePagePath} from "@lib/gql/gql-queries"
import {notFound, permanentRedirect, redirect} from "next/navigation"
import {getPathFromContext} from "@lib/utils/utils"
import type {Slug, PageProps} from "@lib/@types/types"
import NodePageMetadata from "@components/nodes/pages/node-page-metadata"
import {Suspense} from "react"

// Vercel max execution. See https://vercel.com/docs/functions/configuring-functions/duration
export const maxDuration = 30

const Page = (props: PageProps) => (
  <Suspense fallback={<NodePageSkeleton />}>
    <PageContent params={props.params} />
  </Suspense>
)

const PageContent = async ({params}: {params: PageProps["params"]}) => {
  const path = getPathFromContext((await params).slug || "")
  const homePath = await getHomePagePath()
  if (path === homePath) permanentRedirect("/")

  const {redirect: redirectPath, entity} = await getEntityFromPath<NodeUnion>(path)

  if (redirectPath && redirectPath.permanent) permanentRedirect(redirectPath.url)
  if (redirectPath && !redirectPath.permanent) redirect(redirectPath.url)
  if (!entity) notFound()

  return (
    <>
      <NodePageMetadata pageTitle={path !== "/" ? entity.title : undefined} metatags={entity.metatag} />
      <NodePage node={entity} isHome={path === "/"} />
    </>
  )
}

export const generateStaticParams = async (): Promise<Array<Slug>> => {
  const homePagePath = await getHomePagePath()
  const redirectPaths = await getAllRedirectPaths()

  const paths = (await getAllNodes()).map(node => (node.path === homePagePath ? "/" : node.path)) as Array<string>
  redirectPaths.forEach(p => paths.push(p))
  const nodePaths = paths.map(path => ({slug: path.split("/").filter(part => !!part)}))
  nodePaths.push({slug: ["home"]})
  return nodePaths
}

export default Page
