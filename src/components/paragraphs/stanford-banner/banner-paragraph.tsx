import React, {HtmlHTMLAttributes} from "react"
import {ParagraphStanfordBanner} from "@lib/gql/__generated__/drupal.d"
import {H2, H3, H4} from "@components/elements/headers"
import Wysiwyg from "@components/elements/wysiwyg"
import Button from "@components/elements/button"
import {getParagraphBehaviors} from "@components/paragraphs/get-paragraph-behaviors"
import {twMerge} from "tailwind-merge"
import HeroBanner from "@components/patterns/hero-banner"
import {BannerParagraphBehaviors} from "@lib/drupal/drupal-jsonapi.d"

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  paragraph: ParagraphStanfordBanner
  eagerLoadImage?: boolean
}

const BannerParagraph = ({paragraph, eagerLoadImage, ...props}: Props) => {
  const behaviors = getParagraphBehaviors<BannerParagraphBehaviors>(paragraph)
  const hasCard =
    paragraph.suBannerHeader || paragraph.suBannerButton || paragraph.suBannerBody || paragraph.suBannerSupHeader

  const headerTagChoice = (behaviors.hero_pattern?.heading || "h2").split(".", 2)
  const headerTag = headerTagChoice[0]

  let headerClasses = headerTagChoice[1]?.replace(".", " ").replace("su-font-splash", "type-3 font-bold") || ""
  if (behaviors.hero_pattern?.hide_heading) headerClasses += " sr-only"

  return (
    <HeroBanner
      {...props}
      aria-labelledby={paragraph.suBannerHeader ? paragraph.id : undefined}
      imageUrl={paragraph.suBannerImage?.mediaImage.url}
      imageAlt={paragraph.suBannerImage?.mediaImage.alt}
      isSection={!!paragraph.suBannerHeader && headerTag !== "div"}
      overlayPosition={behaviors.hero_pattern?.overlay_position}
      eagerLoadImage={eagerLoadImage}
    >
      {hasCard && (
        <>
          {paragraph.suBannerHeader && (
            <>
              {headerTag === "h2" && (
                <H2 id={paragraph.id} className={twMerge(headerClasses, "type-2 mb-0")}>
                  {paragraph.suBannerHeader}
                </H2>
              )}
              {headerTag === "h3" && (
                <H3 id={paragraph.id} className={headerClasses}>
                  {paragraph.suBannerHeader}
                </H3>
              )}
              {headerTag === "h4" && (
                <H4 id={paragraph.id} className={headerClasses}>
                  {paragraph.suBannerHeader}
                </H4>
              )}
              {headerTag === "div" && <div className={headerClasses}>{paragraph.suBannerHeader}</div>}
            </>
          )}

          {paragraph.suBannerSupHeader && (
            <div className="order-first text-09em font-semibold">{paragraph.suBannerSupHeader}</div>
          )}

          <Wysiwyg html={paragraph.suBannerBody?.processed} className="type-0" />

          {paragraph.suBannerButton?.url && (
            <Button href={paragraph.suBannerButton.url}>{paragraph.suBannerButton.title}</Button>
          )}
        </>
      )}
    </HeroBanner>
  )
}
export default BannerParagraph
