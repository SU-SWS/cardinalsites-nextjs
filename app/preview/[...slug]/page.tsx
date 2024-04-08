import NodePage from "@components/nodes/pages/node-page";
import UnpublishedBanner from "@components/elements/unpublished-banner";
import {NodeUnion} from "@lib/gql/__generated__/drupal.d";
import {getEntityFromPath} from "@lib/gql/gql-queries";
import {notFound} from "next/navigation";
import {getPathFromContext, isPreviewMode, PageProps} from "@lib/drupal/utils";

const PreviewPage = async ({params}: PageProps) => {
  if (!isPreviewMode()) notFound();
  const { entity, error} = await getEntityFromPath<NodeUnion>(getPathFromContext({params}), true)

  if (error) throw new Error(error);
  if (!entity) notFound();

  return (
    <>
      <UnpublishedBanner status={entity.status}>
        Unpublished Page
      </UnpublishedBanner>
      <NodePage node={entity}/>
    </>
  )
}

export default PreviewPage;