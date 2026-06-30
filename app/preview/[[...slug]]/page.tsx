import NodePage from "@components/nodes/pages/node-page"
import EditorAlert from "@components/elements/editor-alert"
import {NodeUnion} from "@lib/gql/__generated__/graphql"
import {getEntityFromPath, getHomePagePath} from "@lib/gql/gql-queries"
import {notFound} from "next/navigation"
import {getPathFromContext, PageProps, Slug} from "@lib/utils/utils"
import {isPreviewMode} from "@lib/utils/is-preview-mode"
import {Suspense} from "react"
import DrupalWindowSync from "@components/elements/drupal-window-sync"
import Editorially from "@components/tools/editorially"

// Vercel max execution. See https://vercel.com/docs/functions/configuring-functions/duration
export const maxDuration = 30

const PreviewPage = async (props: PageProps) => {
  const params = await props.params
  return (
    <Suspense>
      <Preview slug={params.slug || []} />
    </Suspense>
  )
}

const Preview = async ({slug}: Slug) => {
  if (!(await isPreviewMode())) notFound()

  const path = getPathFromContext(slug)
  const {entity} = await getEntityFromPath<NodeUnion>(path, true)

  if (!entity) notFound()
  const homePath = await getHomePagePath()

  return (
    <EditorAlert status={false} message="Preview Mode">
      <DrupalWindowSync />
      <Editorially />
      <EditorAlert status={entity.status} message="Unpublished Page">
        <NodePage node={entity} isHome={path === homePath} />
      </EditorAlert>
    </EditorAlert>
  )
}

export const generateStaticParams = async (): Promise<Array<Slug>> => {
  return [{slug: ["home"]}]
}

export default PreviewPage
