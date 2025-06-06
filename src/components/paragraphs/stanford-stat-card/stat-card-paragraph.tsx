import {HtmlHTMLAttributes} from "react"
import {ParagraphStanfordStatCard} from "@lib/gql/__generated__/drupal.d"
import {H2} from "@components/elements/headers"
import Wysiwyg from "@components/elements/wysiwyg"
import Link from "@components/elements/link"
import ReverseVisualOrder from "@components/elements/reverse-visual-order"
import ImageCard from "@components/patterns/image-card"

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  paragraph: ParagraphStanfordStatCard
}
const StatCardParagraph = ({paragraph, ...props}: Props) => {
  return (
    <ImageCard
      {...props}
      aria-labelledby={paragraph.suStatHeadline ? paragraph.uuid : undefined}
      imageUrl={paragraph.suStatImage?.mediaImage.url}
      imageAlt={paragraph.suStatImage?.mediaImage.alt}
      isArticle={!!paragraph.suStatHeadline}
    >
      <ReverseVisualOrder>
        <H2>{paragraph.suStatHeadline}</H2>
        <div>
          {paragraph.suStatImage && <div></div>}
          {paragraph.suStatIcon && <div className={`${paragraph.suStatIcon.iconName} ${paragraph.suStatIcon.style}`} />}
          {paragraph.suStatSuperhead && <div>{paragraph.suStatSuperhead}</div>}
        </div>
      </ReverseVisualOrder>
      {JSON.stringify(paragraph.suStatIcon)}
      <Wysiwyg html={paragraph.suStatBody?.processed} />
      {paragraph.suStatButton?.url && <Link href={paragraph.suStatButton.url}>{paragraph.suStatButton.title}</Link>}
    </ImageCard>
  )
}
export default StatCardParagraph
