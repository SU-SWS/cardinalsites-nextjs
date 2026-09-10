import NodePage, {NodePageSkeleton} from "@components/nodes/pages/node-page"
import EditorAlert from "@components/elements/editor-alert"
import {NodeUnion} from "@lib/gql/__generated__/graphql"
import {getEntityFromPath, getHomePagePath} from "@lib/gql/gql-queries"
import {notFound} from "next/navigation"
import {getPathFromContext} from "@lib/utils/utils"
import DrupalWindowSync from "@components/elements/drupal-window-sync"
import Editorially from "@components/tools/editorially"
import type {Slug, PageProps} from "@lib/@types/types"
import {Suspense} from "react"

// Vercel max execution. See https://vercel.com/docs/functions/configuring-functions/duration
export const maxDuration = 30

const PreviewPage = (props: PageProps) => (
  <EditorAlert status={false} message="Preview Mode">
    <DrupalWindowSync />
    <Editorially />
    <Suspense fallback={<NodePageSkeleton />}>
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
  const homePath = await getHomePagePath()

  return (
    <EditorAlert status={entity.status} message="Unpublished Page">
      <NodePage node={entity} isHome={path === homePath} />
    </EditorAlert>
  )
}

export const generateStaticParams = async (): Promise<Array<Slug>> => [{slug: ["home"]}]

export default PreviewPage
