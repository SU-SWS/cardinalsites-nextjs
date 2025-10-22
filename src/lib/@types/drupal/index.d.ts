/**
 * Types that are not provided by Graphql integration.
 */
declare global {
  const Ed11y: object
}

export type LayoutParagraphBehaviors = {
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

export type ListParagraphBehaviors = {
  list_paragraph?: {
    hide_empty?: boolean
    empty_message?: string
    heading_behavior?: "show" | "hide" | "remove"
  }
}

export type CardParagraphBehaviors = {
  su_card_styles?: {
    heading?: "h2" | "h3" | "h4" | "div.su-splash-font"
    hide_heading?: boolean
    link_style?: "action" | "button"
  }
}

export type BannerParagraphBehaviors = {
  hero_pattern?: {
    overlay_position?: "left" | "right"
    heading?: "h2" | "h3" | "h4" | "div.su-splash-font"
    hide_heading?: string
  }
}

export type TeaserParagraphBehaviors = {
  stanford_teaser?: {
    heading_behavior?: "show" | "hide" | "remove"
  }
}

export type FAQParagraphBehaviors = {
  faq_accordions?: {heading?: "h2" | "h3" | "h4"}
}

type ParagraphBehaviorsBase = {
  layout_paragraphs?: LayoutParagraphBehaviors
}

export type ParagraphBehaviors = ParagraphBehaviorsBase &
  (
    | TeaserParagraphBehaviors
    | BannerParagraphBehaviors
    | CardParagraphBehaviors
    | ListParagraphBehaviors
    | FAQParagraphBehaviors
  )
