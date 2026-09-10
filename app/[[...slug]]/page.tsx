import NodePage, {NodePageSkeleton} from "@components/nodes/pages/node-page"
import {NodeUnion} from "@lib/gql/__generated__/graphql"
import {getAllNodes, getEntityFromPath, getHomePagePath} from "@lib/gql/gql-queries"
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

  // Independent lookups: resolving the home page alias doesn't gate fetching this path.
  const [homePath, {redirect: redirectPath, entity}] = await Promise.all([
    getHomePagePath(),
    getEntityFromPath<NodeUnion>(path),
  ])

  if (path === homePath) permanentRedirect("/")

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
