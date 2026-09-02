import {HtmlHTMLAttributes} from "react"
import {ParagraphStanfordMediaCaption} from "@lib/gql/__generated__/graphql"
import Image from "next/image"
import Oembed from "@components/elements/ombed"
import Link from "@components/elements/link"
import Wysiwyg from "@components/elements/wysiwyg"
import cn from "@lib/utils/className"
import {getImagePlaceholder} from "@lib/utils/get-image-placeholder"

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  paragraph: ParagraphStanfordMediaCaption
}

const MediaCaptionParagraph = async ({paragraph, ...props}: Props) => {
  const image =
    paragraph.suMediaCaptionMedia?.__typename === "MediaImage" ? paragraph.suMediaCaptionMedia.mediaImage : undefined
  const videoUrl =
    paragraph.suMediaCaptionMedia?.__typename === "MediaVideo" && paragraph.suMediaCaptionMedia.mediaOembedVideo

  return (
    <figure {...props} className={cn("centered xl:max-w-1200", props.className)}>
      {image?.url && (
        <div className="relative aspect-video w-full">
          <Image
            className="object-cover"
            src={image.url}
            alt={image.alt || ""}
            fill
            sizes="(max-width: 768px) 100vw, 1000px"
            {...await getImagePlaceholder(image.url)}
          />
        </div>
      )}
      {videoUrl && <Oembed url={videoUrl} />}

      <figcaption className="color text-right type-0 text-cool-grey">
        {paragraph.suMediaCaptionLink?.url && (
          <Link href={paragraph.suMediaCaptionLink.url}>{paragraph.suMediaCaptionLink.title}</Link>
        )}

        <Wysiwyg html={paragraph.suMediaCaptionCaption?.processed} />
      </figcaption>
    </figure>
  )
}
export default MediaCaptionParagraph
