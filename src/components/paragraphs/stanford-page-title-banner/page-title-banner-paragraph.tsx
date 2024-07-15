import React, {HtmlHTMLAttributes} from "react"
import {ParagraphStanfordPageTitleBanner} from "@lib/gql/__generated__/drupal.d"
import {H1} from "@components/elements/headers"
import HeroBanner from "@components/patterns/hero-banner"

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  paragraph: ParagraphStanfordPageTitleBanner
  pageTitle: string
}

const PageTitleBannerParagraph = ({paragraph, pageTitle, ...props}: Props) => {
  return (
    <HeroBanner
      {...props}
      imageUrl={paragraph.suTitleBannerImage?.mediaImage.url}
      imageAlt={paragraph.suTitleBannerImage?.mediaImage.alt}
      eagerLoadImage
    >
      <H1 className="type-3 order-2 m-0 mb-[-10px] p-0">{pageTitle}</H1>
    </HeroBanner>
  )
}
export default PageTitleBannerParagraph
