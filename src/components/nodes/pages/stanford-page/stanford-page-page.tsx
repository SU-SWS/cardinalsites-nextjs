import Rows from "@components/paragraphs/rows/rows"
import InteriorPage from "@components/layouts/interior-page"
import {H1} from "@components/elements/headers"
import {HtmlHTMLAttributes} from "react"
import {NodeStanfordPage} from "@lib/gql/__generated__/drupal.d"
import BannerParagraph from "@components/paragraphs/stanford-banner/banner-paragraph"
import PageTitleBannerParagraph from "@components/paragraphs/stanford-page-title-banner/page-title-banner-paragraph"
import NodePageMetadata from "@components/nodes/pages/node-page-metadata"
import {getFirstText} from "@lib/utils/text-tools"
import Wysiwyg from "@components/elements/wysiwyg"

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  node: NodeStanfordPage
  headingLevel?: "h2" | "h3"
}

const StanfordPagePage = ({node, ...props}: Props) => {
  const fullWidth = node.layoutSelection?.id === "stanford_basic_page_full"

  return (
    <article {...props}>
      <NodePageMetadata
        pageTitle={node.title}
        metatags={node.metatag}
        backupDescription={getFirstText(node.suPageComponents)}
      />
      {node.suPageBanner?.__typename === "ParagraphStanfordBanner" && (
        <header>
          <BannerParagraph paragraph={node.suPageBanner} eagerLoadImage />
        </header>
      )}
      {node.suPageBanner?.__typename === "ParagraphStanfordPageTitleBanner" && (
        <header>
          <PageTitleBannerParagraph paragraph={node.suPageBanner} pageTitle={node.title} />
        </header>
      )}

      {node.suPageBanner?.__typename !== "ParagraphStanfordPageTitleBanner" && (
        <H1 className="centered mt-32">{node.title}</H1>
      )}

      {!fullWidth && (
        <InteriorPage currentPath={node.path || "#"}>
          <Wysiwyg html={node.body?.processed} className="centered mb-32 xl:max-w-[980px]" />
          <Rows components={node.suPageComponents} />
        </InteriorPage>
      )}

      {fullWidth && <Rows components={node.suPageComponents} />}
    </article>
  )
}
export default StanfordPagePage
