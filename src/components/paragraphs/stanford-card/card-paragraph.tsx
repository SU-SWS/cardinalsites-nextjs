import {HtmlHTMLAttributes} from "react";
import {ParagraphStanfordCard} from "@lib/gql/__generated__/drupal.d";
import {getParagraphBehaviors} from "@components/paragraphs/get-paragraph-behaviors";
import {H2, H3, H4} from "@components/elements/headers";
import Wysiwyg from "@components/elements/wysiwyg";
import ActionLink from "@components/elements/action-link";
import Button from "@components/elements/button";
import {twMerge} from "tailwind-merge";
import ImageCard from "@components/patterns/image-card";

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  paragraph: ParagraphStanfordCard
}

const CardParagraph = ({paragraph, ...props}: Props) => {
  const behaviors = getParagraphBehaviors(paragraph)

  const image = paragraph.suCardMedia?.__typename === 'MediaImage' ? paragraph.suCardMedia.mediaImage : undefined;
  const videoUrl = paragraph.suCardMedia?.__typename === 'MediaVideo' ? paragraph.suCardMedia.mediaOembedVideo : undefined;

  const headerTagChoice = (behaviors.su_card_styles?.heading || 'h2').split('.', 2);
  const headerTag = headerTagChoice[0]
  const headerClasses = headerTagChoice[1]?.replace('.', ' ').replace('su-font-splash', 'text-m2 font-bold')

  const hideHeader = behaviors.su_card_styles?.hide_heading;

  return (
    <ImageCard
      {...props}
      aria-labelledby={paragraph.suCardHeader ? paragraph.id : undefined}
      imageUrl={image?.url}
      imageAlt={image?.alt}
      videoUrl={videoUrl}
      isArticle={!!paragraph.suCardHeader}
    >
      {paragraph.suCardHeader &&
        <div id={paragraph.id} className={twMerge("order-2", hideHeader && "sr-only")}>
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
    </ImageCard>
  )
}

export default CardParagraph
