import React, {HtmlHTMLAttributes} from "react";
import {ParagraphStanfordBanner} from "@lib/gql/__generated__/drupal.d";
import Image from "next/image";
import {H2, H3, H4} from "@components/elements/headers";
import Wysiwyg from "@components/elements/wysiwyg";
import Button from "@components/elements/button";
import {getParagraphBehaviors} from "@components/paragraphs/get-paragraph-behaviors";
import {twMerge} from "tailwind-merge";

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  paragraph: ParagraphStanfordBanner
  eagerLoadImage?: boolean
}

const BannerParagraph = ({paragraph, eagerLoadImage, ...props}: Props) => {
  const behaviors = getParagraphBehaviors(paragraph);
  const hasCard = paragraph.suBannerHeader || paragraph.suBannerButton || paragraph.suBannerBody || paragraph.suBannerSupHeader

  const headerTagChoice = (behaviors.hero_pattern?.heading || 'h2').split('.', 2);
  const headerTag = headerTagChoice[0]
  const headerClasses = headerTagChoice[1]?.replace('.', ' ').replace('su-font-splash', 'text-m2 font-bold')


  return (
    <div {...props}>
      <div className="@container md:min-h-[400px] rs-mb-5">
        <div
          className="aspect-[16/9] @6xl:aspect-auto relative @6xl:absolute w-full @6xl:h-full bg-cool-grey">
          {paragraph.suBannerImage?.mediaImage.url &&
            <Image
              className="object-cover"
              src={paragraph.suBannerImage.mediaImage.url}
              alt={paragraph.suBannerImage.mediaImage.alt || ""}
              loading={eagerLoadImage ? "eager" : "lazy"}
              fill
              sizes="100vw"
            />
          }
        </div>

        {hasCard &&
          <div
            className={twMerge("w-full relative shadow-lg flex flex-col gap-10 rs-p-2 @6xl:bg-white @6xl:max-w-[550px] @6xl:my-20 @6xl:z-10", behaviors.hero_pattern?.overlay_position === "right" ? "@6xl:ml-auto @6xl:mr-20" : "@6xl:mr-auto @6xl:ml-20")}>

            {paragraph.suBannerHeader &&
              <div className={twMerge("order-2", behaviors.hero_pattern?.hide_heading && "sr-only")}>
                {headerTag === 'h2' &&
                  <H2 className={headerClasses}>{paragraph.suBannerHeader}</H2>
                }
                {headerTag === 'h3' &&
                  <H3 className={headerClasses}>{paragraph.suBannerHeader}</H3>
                }
                {headerTag === 'h4' &&
                  <H4 className={headerClasses}>{paragraph.suBannerHeader}</H4>
                }
                {headerTag === 'div' &&
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
          </div>
        }

      </div>
    </div>
  )
}
export default BannerParagraph