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
// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/ensureStatic
export const ensureStatic = "navigation"

const Page = (props: PageProps) => (
  <Suspense fallback={<NodePageSkeleton />}>
    <PageContent params={props.params} />
  </Suspense>
)

const PageContent = async ({params}: {params: PageProps["params"]}) => {
  const path = getPathFromContext((await params).slug || "")

  // Scanner probes (`/.env`, `/.git/config`, `/wp-login.php`) never match a Drupal alias. Rejecting them here skips the
  // Drupal query and the cache entry each new junk path would otherwise create. Extensions like `.html` are left
  // alone since migrated sites can keep legacy aliases that use them.
  if (SCANNER_PATH.test(path)) notFound()

  // Independent lookups: resolving the home page alias doesn't gate fetching this path.
  const [homePath, {redirect: redirectPath, entity}] = await Promise.all([
    getHomePagePath(),
    getEntityFromPath<NodeUnion>(path),
  ])

  if (path === homePath) permanentRedirect("/")

  if (redirectPath && redirectPath.permanent) permanentRedirect(redirectPath.url)
  if (redirectPath && !redirectPath.permanent) redirect(redirectPath.url)
  if (!entity) notFound()

  // Internal content is only served behind authentication by /internal. Drupal matches paths case
  // insensitively, so a request like `/INTERNAL/page` would skip the proxy and land here instead.
  if (isInternalPath(path) || isInternalPath(entity.path)) notFound()

  return (
    <>
      <NodePageMetadata pageTitle={path !== "/" ? entity.title : undefined} metatags={entity.metatag} />
      <NodePage node={entity} isHome={path === "/"} />
    </>
  )
}

// A path segment starting with a dot, or a server-side script, config or backup file extension.
const SCANNER_PATH = /(^|\/)\.|\.(php\d?|phtml|asp|aspx|jsp|cgi|env|ini|sql|bak|old|swp|ya?ml|log|config)$/i

const isInternalPath = (path?: string | null) => {
  let decoded = path?.toLowerCase() || ""
  try {
    decoded = decodeURIComponent(decoded)
  } catch {
    // Keep the raw path when the percent encoding is malformed.
  }
  return decoded === "/internal" || decoded.startsWith("/internal/")
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
