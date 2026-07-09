import Rows from "@components/paragraphs/rows/rows"
import InteriorPage from "@components/layouts/interior-page"
import {H1} from "@components/elements/headers"
import {HtmlHTMLAttributes} from "react"
import {NodeStanfordPage} from "@lib/gql/__generated__/graphql"
import BannerParagraph from "@components/paragraphs/stanford-banner/banner-paragraph"
import PageTitleBannerParagraph from "@components/paragraphs/stanford-page-title-banner/page-title-banner-paragraph"
import NodePageMetadata from "@components/nodes/pages/node-page-metadata"
import {getFirstText} from "@lib/utils/text-tools"
import Wysiwyg from "@components/elements/wysiwyg"
import AnchorNav from "@components/elements/anchor-nav"
import cn from "@lib/utils/className"
import ReverseVisualOrder from "@components/elements/reverse-visual-order"

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  node: NodeStanfordPage
  isHome?: boolean
}

const StanfordPagePage = ({node, isHome, ...props}: Props) => {
  const layout = node.layoutSelection?.id
  const anchorPosition =
    layout === "left_anchor_nav" || layout === "left_anchor_no_nav"
      ? "left"
      : layout === "top_anchor_nav" || layout === "top_anchor_nav_full_width"
        ? "top"
        : false
  const hideSecondaryNav = layout === "left_anchor_no_nav"
  const fullWidth = layout === "stanford_basic_page_full" || layout === "top_anchor_nav_full_width"

  return (
    <article {...props}>
      <NodePageMetadata
        pageTitle={!isHome ? node.title : undefined}
        metatags={node.metatag}
        backupDescription={getFirstText(node.suPageComponents)}
      />

      <ReverseVisualOrder>
        {node.suPageBanner?.__typename !== "ParagraphStanfordPageTitleBanner" && (
          <H1 className={cn("centered mt-32", {"sr-only": isHome})}>{node.title}</H1>
        )}

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
      </ReverseVisualOrder>

      {!fullWidth && (
        <InteriorPage
          currentPath={node.path || "#"}
          leftSideBar={anchorPosition === "left" && <AnchorNav />}
          hideSecondaryNav={hideSecondaryNav}
        >
          {anchorPosition === "top" && <AnchorNav horizontal />}
          <Wysiwyg html={node.body?.processed} className="centered mb-32 xl:max-w-[980px]" />
          <Rows components={node.suPageComponents} />
        </InteriorPage>
      )}

      {fullWidth && (
        <>
          {anchorPosition === "top" && <AnchorNav horizontal />}
          <Wysiwyg html={node.body?.processed} className="centered mb-32 xl:max-w-[980px]" />
          <Rows components={node.suPageComponents} />
        </>
      )}
    </article>
  )
}
export default StanfordPagePage
