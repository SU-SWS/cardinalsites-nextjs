import NodePage from "@components/nodes/pages/node-page";
import UnpublishedBanner from "@components/elements/unpublished-banner";
import {NodeUnion} from "@lib/gql/__generated__/drupal.d";
import {getEntityFromPath} from "@lib/gql/gql-queries";
import {notFound} from "next/navigation";
import Editori11y from "@components/tools/editorially";
import {getPathFromContext, isPreviewMode, PageProps} from "@lib/drupal/utils";

const Page = async ({params}: PageProps) => {
  const path = getPathFromContext({params})
  if (!isPreviewMode()) notFound();

  const { entity, error} = await getEntityFromPath<NodeUnion>(path, true)

  if (error) throw new Error(error);
  if (!entity) notFound();

  return (
    <>
      <Editori11y/>
      <UnpublishedBanner status={false}>
        Preview Mode
      </UnpublishedBanner>
      <UnpublishedBanner status={entity.status}>
        Unpublished Page
      </UnpublishedBanner>
      <NodePage node={entity}/>
    </>
  )
}

export default Page;