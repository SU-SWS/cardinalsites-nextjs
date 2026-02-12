import Rows from "@components/paragraphs/rows/rows"
import {notFound} from "next/navigation"
import {getConfigPageField, getEntityFromPath} from "@lib/gql/gql-queries"
import {NodeStanfordPage, StanfordBasicSiteSetting} from "@lib/gql/__generated__/drupal.d"
import BannerParagraph from "@components/paragraphs/stanford-banner/banner-paragraph"
import NodePageMetadata from "@components/nodes/pages/node-page-metadata"

const Home = async () => {
  "use cache"

  const {entity} = await getEntityFromPath<NodeStanfordPage>("/")
  if (!entity) notFound()

  const siteName =
    (await getConfigPageField<StanfordBasicSiteSetting, StanfordBasicSiteSetting["suSiteName"]>(
      "StanfordBasicSiteSetting",
      "suSiteName"
    )) || "Stanford University"

  return (
    <article>
      <h1 className="sr-only" id="page-title">
        {siteName}
      </h1>
      <NodePageMetadata pageTitle={undefined} metatags={entity.metatag} />
      {entity.suPageBanner?.__typename === "ParagraphStanfordBanner" && (
        <header>
          <BannerParagraph paragraph={entity.suPageBanner} eagerLoadImage />
        </header>
      )}
      {entity.suPageComponents && <Rows components={entity.suPageComponents} />}
    </article>
  )
}

export default Home
