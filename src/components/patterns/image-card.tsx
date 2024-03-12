import {twMerge} from "tailwind-merge";
import Image from "next/image";
import Oembed from "@components/elements/ombed";
import {ElementType, HTMLAttributes} from "react";
import {Maybe} from "@lib/gql/__generated__/drupal";

type Props = HTMLAttributes<HTMLElement | HTMLDivElement> & {
  imageUrl?: Maybe<string>
  imageAlt?: Maybe<string>
  videoUrl?: Maybe<string>
  isArticle?: Maybe<boolean>
}

const ImageCard = ({imageUrl, imageAlt, videoUrl, isArticle, children, ...props}: Props) => {
  const CardWrapper: ElementType = isArticle ? 'article' : 'div';

  return (
    <CardWrapper
      {...props}
      className={twMerge("centered lg:max-w-[980px] w-full shadow-lg border border-black-10", props.className)}
    >
      {imageUrl &&
        <div className="relative aspect-[16/9] w-full">
          <Image
            className="object-cover object-center"
            src={imageUrl}
            alt={imageAlt || ""}
            fill
            sizes="(max-width: 768px) 100vw, 1000px"
          />
        </div>
      }

      {videoUrl &&
        <Oembed url={videoUrl}/>
      }

      <div className="py-20 px-10 lg:px-20 flex flex-col gap-5">
        {children}
      </div>
    </CardWrapper>
  )
}

export default ImageCard;