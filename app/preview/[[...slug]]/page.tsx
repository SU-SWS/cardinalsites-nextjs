import NodePage, {NodePageSkeleton} from "@components/nodes/pages/node-page"
import EditorAlert from "@components/elements/editor-alert"
import {NodeUnion} from "@lib/gql/__generated__/graphql"
import {getEntityFromPath, getHomePagePath} from "@lib/gql/gql-queries"
import {notFound} from "next/navigation"
import {getPathFromContext} from "@lib/utils/utils"
import type {PageProps} from "@lib/@types/types"
import {Suspense} from "react"
import EditorTools from "./editor-tools"

// Vercel max execution. See https://vercel.com/docs/functions/configuring-functions/duration
export const maxDuration = 30

const PreviewPage = (props: PageProps) => (
  <EditorAlert status={false} message="Preview Mode">
    <Suspense fallback={<NodePageSkeleton />}>
      <EditorTools />
      <PreviewContent params={props.params} />
    </Suspense>
  </EditorAlert>
)

// Deliberately uncached: this renders draft content for an editor, so every request re-reads it
// from Drupal. It streams inside the Suspense boundary above.
const PreviewContent = async ({params}: {params: PageProps["params"]}) => {
  const path = getPathFromContext((await params).slug || [])
  const {entity} = await getEntityFromPath<NodeUnion>(path, true)

  if (!entity) notFound()
  // The draft still renders when the published home page can't be resolved; it just isn't styled as the home page.
  const homePath = await getHomePagePath().catch(() => undefined)

  return (
    <EditorAlert status={entity.status} message="Unpublished Page">
      <NodePage node={entity} isHome={path === homePath} />
    </EditorAlert>
  )
}

export default PreviewPage
