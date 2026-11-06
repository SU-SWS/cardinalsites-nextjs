import Image from "next/image"
import Link from "@components/elements/link"
import {HtmlHTMLAttributes} from "react"
import {ParagraphStanfordPersonCtum} from "@lib/gql/__generated__/graphql"
import cn from "@lib/utils/className"
import {getImageStyle} from "@lib/utils/image-style"

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  paragraph: ParagraphStanfordPersonCtum
}

const PersonCtaParagraph = ({paragraph, ...props}: Props) => {
  const image = paragraph.suPersonCtaImage?.mediaImage
  const ctaImage = getImageStyle(image, "ctaStyle")
  return (
    <div {...props} className={cn("centered flex gap-20", props.className)}>
      {image?.url && (
        <div className="relative aspect-square w-200">
          <Image
            className="rounded-full"
            src={ctaImage?.url || image.url}
            alt={image.alt || ""}
            fill
            sizes="200px"
            unoptimized={!!ctaImage}
          />
        </div>
      )}

      <div>
        {paragraph.suPersonCtaLink?.url && (
          <div>
            <Link href={paragraph.suPersonCtaLink.url}>{paragraph.suPersonCtaName}</Link>
          </div>
        )}

        {!paragraph.suPersonCtaLink && <div>{paragraph.suPersonCtaName}</div>}

        {paragraph.suPersonCtaTitle}
      </div>
    </div>
  )
}
export default PersonCtaParagraph
