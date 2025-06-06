import CardParagraph from "@components/paragraphs/stanford-card/card-paragraph"
import EntityParagraph from "@components/paragraphs/stanford-entity/entity-paragraph"
import GalleryParagraph from "@components/paragraphs/stanford-gallery/gallery-paragraph"
import MediaCaptionParagraph from "@components/paragraphs/stanford-media-caption/media-caption-paragraph"
import SpacerParagraph from "@components/paragraphs/stanford-spacer/spacer-paragraph"
import WysiwygParagraph from "@components/paragraphs/stanford-wysiwyg/wysiwyg-paragraph"
import BannerParagraph from "@components/paragraphs/stanford-banner/banner-paragraph"
import ListParagraph from "@components/paragraphs/stanford-lists/list-paragraph"
import {ParagraphUnion} from "@lib/gql/__generated__/drupal.d"
import {Suspense} from "react"
import EditorAlert from "@components/elements/editor-alert"
import FaqParagraph from "@components/paragraphs/stanford-faq/faq-paragraph"
import FilteredListParagraph from "@components/paragraphs/stanford-filtered-lists/filtered-list-paragraph"
import StatCardParagraph from "@components/paragraphs/stanford-stat-card/stat-card-paragraph"

type Props = {
  /**
   * Paragraph entity todisplay.
   */
  paragraph: ParagraphUnion
}

const Paragraph = async ({paragraph}: Props) => {
  return (
    <EditorAlert status={paragraph.status} message="Unpublished Content">
      <ParagraphComponent paragraph={paragraph} />
    </EditorAlert>
  )
}

const ParagraphComponent = async ({paragraph}: Props) => {
  const itemProps: Record<string, string> = {}
  if (process.env.NODE_ENV === "development") {
    itemProps["data-type"] = paragraph.__typename || "unknown"
    itemProps["data-id"] = paragraph.uuid
  }

  switch (paragraph.__typename) {
    case "ParagraphStanfordBanner":
      return <BannerParagraph paragraph={paragraph} {...itemProps} />
    case "ParagraphStanfordCard":
      return <CardParagraph paragraph={paragraph} {...itemProps} />
    case "ParagraphStanfordEntity":
      return <EntityParagraph paragraph={paragraph} {...itemProps} />
    case "ParagraphStanfordFaq":
      return <FaqParagraph paragraph={paragraph} {...itemProps} />
    case "ParagraphStanfordGallery":
      return <GalleryParagraph paragraph={paragraph} {...itemProps} />
    case "ParagraphStanfordMediaCaption":
      return <MediaCaptionParagraph paragraph={paragraph} {...itemProps} />
    case "ParagraphStanfordSpacer":
      return <SpacerParagraph paragraph={paragraph} {...itemProps} />
    case "ParagraphStanfordWysiwyg":
      return <WysiwygParagraph paragraph={paragraph} {...itemProps} />
    case "ParagraphStanfordStatCard":
      return <StatCardParagraph paragraph={paragraph} {...itemProps} />
    case "ParagraphStanfordList":
      return (
        <Suspense>
          <ListParagraph paragraph={paragraph} {...itemProps} />
        </Suspense>
      )
    case "ParagraphStanfordFilteredList":
      return (
        <Suspense>
          <FilteredListParagraph paragraph={paragraph} {...itemProps} />
        </Suspense>
      )
  }
  console.warn(`Unknown paragraph ${paragraph.__typename}. Item ${paragraph.uuid}.`)
}
export default Paragraph
