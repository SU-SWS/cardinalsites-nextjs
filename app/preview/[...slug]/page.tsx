import NodePage from "@components/nodes/pages/node-page"
import EditorAlert from "@components/elements/editor-alert"
import {NodeUnion} from "@lib/gql/__generated__/drupal.d"
import {getEntityFromPath} from "@lib/gql/gql-queries"
import {notFound} from "next/navigation"
import {getPathFromContext, PageProps, Slug} from "@lib/drupal/utils"
import {isPreviewMode} from "@lib/drupal/is-preview-mode"

const PreviewPage = async (props: PageProps) => {
  const params = await props.params
  if (!isPreviewMode()) notFound()
  const {entity} = await getEntityFromPath<NodeUnion>(getPathFromContext(params.slug), true)

  if (!entity) notFound()

  return (
    <>
      <EditorAlert status={entity.status} message="Unpublished Page" />
      <NodePage node={entity} />
    </>
  )
}

export const generateStaticParams = async (): Promise<Array<Slug>> => {
  return []
}

export default PreviewPage
