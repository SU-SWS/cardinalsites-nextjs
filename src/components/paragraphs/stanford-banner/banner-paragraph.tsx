import React, {HtmlHTMLAttributes} from "react";
import {ParagraphStanfordBanner} from "@lib/gql/__generated__/drupal.d";
import {H2, H3, H4} from "@components/elements/headers";
import Wysiwyg from "@components/elements/wysiwyg";
import Button from "@components/elements/button";
import {getParagraphBehaviors} from "@components/paragraphs/get-paragraph-behaviors";
import {twMerge} from "tailwind-merge";
import HeroBanner from "@components/patterns/hero-banner";

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  paragraph: ParagraphStanfordBanner
  eagerLoadImage?: boolean
}

const BannerParagraph = ({paragraph, eagerLoadImage, ...props}: Props) => {
  const behaviors = getParagraphBehaviors(paragraph);
  const hasCard = paragraph.suBannerHeader || paragraph.suBannerButton || paragraph.suBannerBody || paragraph.suBannerSupHeader

  const headerTagChoice = (behaviors.hero_pattern?.heading || "h2").split(".", 2);
  const headerTag = headerTagChoice[0]
  const headerClasses = headerTagChoice[1]?.replace(".", " ").replace("su-font-splash", "text-m2 font-bold")

  return (
    <HeroBanner
      {...props}
      aria-labelledby={paragraph.suBannerHeader ? paragraph.id : undefined}
      imageUrl={paragraph.suBannerImage?.mediaImage.url}
      imageAlt={paragraph.suBannerImage?.mediaImage.alt}
      isSection={!!paragraph.suBannerHeader}
      overlayPosition={behaviors.hero_pattern?.overlay_position}
      eagerLoadImage={eagerLoadImage}
    >
      {hasCard &&
        <>
          {paragraph.suBannerHeader &&
            <div id={paragraph.id} className={twMerge("order-2", behaviors.hero_pattern?.hide_heading && "sr-only")}>
              {headerTag === "h2" &&
                <H2 className={twMerge(headerClasses, "mb-0")}>{paragraph.suBannerHeader}</H2>
              }
              {headerTag === "h3" &&
                <H3 className={headerClasses}>{paragraph.suBannerHeader}</H3>
              }
              {headerTag === "h4" &&
                <H4 className={headerClasses}>{paragraph.suBannerHeader}</H4>
              }
              {headerTag === "div" &&
                <div className={headerClasses}>{paragraph.suBannerHeader}</div>
              }
            </div>
          }

          {paragraph.suBannerSupHeader &&
            <div className="order-1 text-09em font-semibold">
              {paragraph.suBannerSupHeader}
            </div>
          }

          <Wysiwyg html={paragraph.suBannerBody?.processed} className="order-3 text-m0"/>

          {paragraph.suBannerButton?.url &&
            <div className="order-4">
              <Button href={paragraph.suBannerButton.url}>
                {paragraph.suBannerButton.title}
              </Button>
            </div>
          }
        </>
      }
    </HeroBanner>
  )
}
export default BannerParagraph