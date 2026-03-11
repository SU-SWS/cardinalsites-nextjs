import {Maybe} from "@lib/gql/__generated__/graphql"

/**
 * Types that are not provided by Graphql integration.
 */
declare global {
  const Ed11y: object
}

export type LayoutParagraphBehaviors = {
  layout_paragraphs: {
    layout: "layout_paragraphs_1_column" | "layout_paragraphs_2_column" | "layout_paragraphs_3_column" | string
    config: {
      label?: string
      bg_color?: string
      bottom_margin?: "none"
      bottom_padding?: "none"
      top_padding?: "none" | "more"
    }
    parent_uuid?: string
    region?: string
  }
}

export type ListParagraphBehaviors = LayoutParagraphBehaviors & {
  list_paragraph?: {
    hide_empty?: boolean
    empty_message?: string
    heading_behavior?: "show" | "hide" | "remove"
  }
}

export type CardParagraphBehaviors = LayoutParagraphBehaviors & {
  su_card_styles?: {
    heading?: "h2" | "h3" | "h4" | "div.su-splash-font"
    hide_heading?: boolean
    link_style?: "action" | "button"
  }
}

export type OverlayColors = Maybe<"#000000" | "#620059" | "#016895" | "#006B81" | "#175E54" | "#544948">

export type BannerParagraphBehaviors = LayoutParagraphBehaviors & {
  hero_pattern?: {
    overlay_position?: "left" | "right" | "center"
    overlay_color?: OverlayColors
    heading?: "h2" | "h3" | "h4" | "div.su-splash-font"
    hide_heading?: string
  }
}

export type TeaserParagraphBehaviors = LayoutParagraphBehaviors & {
  stanford_teaser?: {
    heading_behavior?: "show" | "hide" | "remove"
  }
}

export type FAQParagraphBehaviors = LayoutParagraphBehaviors & {
  faq_accordions?: {heading?: "h2" | "h3" | "h4"}
}

export type ParagraphBehaviors =
  | LayoutParagraphBehaviors
  | TeaserParagraphBehaviors
  | BannerParagraphBehaviors
  | CardParagraphBehaviors
  | ListParagraphBehaviors
  | FAQParagraphBehaviors
