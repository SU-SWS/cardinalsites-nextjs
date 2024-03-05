export type LayoutParagraphBehaviors = {
  layout: "layout_paragraphs_1_column" | "layout_paragraphs_2_column" | "layout_paragraphs_3_column" | string
  config: { label?: string }
  parent_uuid?: string
  region?: string
}

export type ListParagraphBehaviors = {
  hide_empty?: boolean
  empty_message?: string
  hide_heading?: boolean
}

export type CardParagraphBehaviors = {
  heading?: 'h2' | 'h3' | 'h4' | 'div.su-splash-font'
  hide_heading?: boolean
  link_style?: 'action' | 'button'
}

export type BannerParagraphBehaviors = {
  overlay_position?: 'left' | 'right'
  heading?: 'h2' | 'h3' | 'h4' | 'div.su-splash-font'
  hide_heading?: string
}

export type TeaserParagraphBehaviors = {
  hide_heading?: boolean
}

export type ParagraphBehaviors = {
  layout_paragraphs?: LayoutParagraphBehaviors
  list_paragraph?: ListParagraphBehaviors
  su_card_styles?: CardParagraphBehaviors
  hero_pattern?: BannerParagraphBehaviors
  stanford_teaser?: TeaserParagraphBehaviors
}
