import {HtmlHTMLAttributes} from "react";
import {ParagraphStanfordCard} from "@lib/gql/__generated__/drupal.d";
import {getParagraphBehaviors} from "@components/paragraphs/get-paragraph-behaviors";
import Image from "next/image";
import Oembed from "@components/elements/ombed";
import {H2, H3, H4} from "@components/elements/headers";
import Wysiwyg from "@components/elements/wysiwyg";
import ActionLink from "@components/elements/action-link";
import Button from "@components/elements/button";
import {twMerge} from "tailwind-merge";

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  paragraph: ParagraphStanfordCard
}

const CardParagraph = ({paragraph, ...props}: Props) => {
  const behaviors = getParagraphBehaviors(paragraph)

  const image = paragraph.suCardMedia?.__typename === 'MediaImage' ? paragraph.suCardMedia.mediaImage : undefined;
  const videoUrl = paragraph.suCardMedia?.__typename === 'MediaVideo' && paragraph.suCardMedia.mediaOembedVideo;

  const headerTagChoice = (behaviors.su_card_styles?.heading || 'h2').split('.', 2);
  const headerTag = headerTagChoice[0]
  const headerClasses = headerTagChoice[1]?.replace('.', ' ').replace('su-font-splash', 'text-m2 font-bold')

  const hideHeader = behaviors.su_card_styles?.hide_heading;

  return (
    <div {...props}>
      <div className="centered lg:max-w-[980px] w-full shadow-lg border border-black-10">
        {image?.url &&
          <div className="relative aspect-[16/9] w-full">
            <Image
              className="object-cover object-center"
              src={image.url}
              alt={image.alt || ""}
              fill
              sizes="(max-width: 768px) 100vw, 1000px"
            />
          </div>
        }

        {videoUrl &&
          <Oembed url={videoUrl}/>
        }

        <div className="py-20 px-10 lg:px-20 flex flex-col gap-5">
          {paragraph.suCardHeader &&
            <div className={twMerge("order-2", hideHeader && "sr-only")}>
              {headerTag === 'h2' &&
                <H2 className={headerClasses}>{paragraph.suCardHeader}</H2>
              }
              {headerTag === 'h3' &&
                <H3 className={headerClasses}>{paragraph.suCardHeader}</H3>
              }
              {headerTag === 'h4' &&
                <H4 className={headerClasses}>{paragraph.suCardHeader}</H4>
              }
              {headerTag === 'div' &&
                <div className={headerClasses}>{paragraph.suCardHeader}</div>
              }
            </div>
          }

          {paragraph.suCardSuperHeader &&
            <div className="order-1 font-semibold">
              {paragraph.suCardSuperHeader}
            </div>
          }

          <Wysiwyg html={paragraph.suCardBody?.processed} className="order-3"/>

          {paragraph.suCardLink?.url &&
            <div className="order-4">
              {behaviors.su_card_styles?.link_style === 'action' &&
                <ActionLink href={paragraph.suCardLink.url}>
                  {paragraph.suCardLink.title}
                </ActionLink>
              }

              {behaviors.su_card_styles?.link_style != 'action' &&
                <Button href={paragraph.suCardLink.url}>
                  {paragraph.suCardLink.title}
                </Button>
              }
            </div>
          }
        </div>
      </div>
    </div>
  )
}

export default CardParagraph
