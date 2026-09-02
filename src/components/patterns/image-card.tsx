import cn from "@lib/utils/className"
import Image from "next/image"
import Oembed from "@components/elements/ombed"
import {ElementType, HTMLAttributes} from "react"
import {Maybe} from "@lib/gql/__generated__/graphql"

type Props = HTMLAttributes<HTMLElement | HTMLDivElement> & {
  /**
   * Absolute image url path.
   */
  imageUrl?: Maybe<string>
  /**
   * Image alt string.
   */
  imageAlt?: Maybe<string>
  /**
   * Absolute url for the video, typically an oembed url.
   */
  videoUrl?: Maybe<string>
  /**
   * If the wrapper should be an article or a div, use an article if an appropriate heading is within the card.
   */
  isArticle?: Maybe<boolean>
  /**
   * If the image aspect ratio should be 1:1 instead of 16:9
   */
  squareImage?: Maybe<boolean>
}

const ImageCard = ({imageUrl, imageAlt, videoUrl, isArticle, squareImage, children, ...props}: Props) => {
  const CardWrapper: ElementType = isArticle ? "article" : "div"

  return (
    <CardWrapper
      {...props}
      className={cn(
        "@container relative centered w-full border border-black-10 bg-white shadow-lg xl:max-w-980",
        props.className
      )}
    >
      {imageUrl && (
        <div className={cn("relative w-full", {"aspect-square": squareImage, "aspect-video": !squareImage})}>
          <Image
            className="object-cover object-center"
            src={imageUrl}
            alt={imageAlt || ""}
            fill
            sizes="(max-width: 768px) 100vw, 1000px"
          />
        </div>
      )}

      {videoUrl && <Oembed url={videoUrl} />}

      <div className="flex flex-col gap-10 p-20 @6xl:p-30 @9xl:px-40">{children}</div>
    </CardWrapper>
  )
}

export const ImageCardSkeleton = () => {
  return (
    <div className="centered w-full border border-black-10 pb-40 shadow-lg xl:max-w-980">
      <div className="aspect-video w-full bg-black-10"></div>
    </div>
  )
}

export default ImageCard
