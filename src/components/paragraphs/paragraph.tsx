import CardParagraph from "@components/paragraphs/stanford-card/card-paragraph";
import EntityParagraph from "@components/paragraphs/stanford-entity/entity-paragraph";
import GalleryParagraph from "@components/paragraphs/stanford-gallery/gallery-paragraph";
import MediaCaptionParagraph from "@components/paragraphs/stanford-media-caption/media-caption-paragraph";
import SpacerParagraph from "@components/paragraphs/stanford-spacer/spacer-paragraph";
import WysiwygParagraph from "@components/paragraphs/stanford-wysiwyg/wysiwyg-paragraph";
import BannerParagraph from "@components/paragraphs/stanford-banner/banner-paragraph";
import ListParagraph from "@components/paragraphs/stanford-lists/list-paragraph";
import {isDraftMode} from "@lib/drupal/utils";
import {ParagraphUnion} from "@lib/gql/__generated__/drupal.d";
import {Suspense} from "react";

const Paragraph = async ({paragraph}: { paragraph: ParagraphUnion }) => {
  const draftMode = isDraftMode()

  const itemProps: Record<string, string> = {}
  if (draftMode) {
    itemProps['data-type'] = paragraph.__typename || 'unknown';
    itemProps['data-id'] = paragraph.id;
  }

  switch (paragraph.__typename) {
    case 'ParagraphStanfordBanner':
      return <BannerParagraph paragraph={paragraph} {...itemProps}/>
    case 'ParagraphStanfordCard':
      return <CardParagraph paragraph={paragraph} {...itemProps}/>
    case 'ParagraphStanfordEntity':
      return <EntityParagraph paragraph={paragraph} {...itemProps}/>
    case 'ParagraphStanfordGallery':
      return <GalleryParagraph paragraph={paragraph} {...itemProps}/>
    case 'ParagraphStanfordMediaCaption':
      return <MediaCaptionParagraph paragraph={paragraph} {...itemProps}/>
    case 'ParagraphStanfordSpacer':
      return <SpacerParagraph paragraph={paragraph} {...itemProps}/>
    case 'ParagraphStanfordWysiwyg':
      return <WysiwygParagraph paragraph={paragraph} {...itemProps}/>
    case 'ParagraphStanfordList':
      return (
        <Suspense>
          <ListParagraph paragraph={paragraph} {...itemProps}/>
        </Suspense>
      )
  }
  console.log(`Unknown paragraph ${paragraph.__typename}. Item ${paragraph.id}.`);
}
export default Paragraph;