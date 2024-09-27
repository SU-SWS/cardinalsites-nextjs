import React, {ElementType, HtmlHTMLAttributes} from "react"
import Image from "next/image"
import twMerge from "@lib/utils/twMerge"
import {Maybe} from "@lib/gql/__generated__/drupal"
import {getImagePlaceholder} from "@lib/utils/get-image-placeholder"
import {clsx} from "clsx"

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  /**
   * Absolute image url path.
   */
  imageUrl?: Maybe<string>
  /**
   * Image alt string.
   */
  imageAlt?: Maybe<string>
  /**
   * Is the banner supposed to be a section or a div.
   */
  isSection?: Maybe<boolean>
  /**
   * Eagerly load the banner image.
   */
  eagerLoadImage?: Maybe<boolean>
  /**
   * Position of the text over the image.
   */
  overlayPosition?: Maybe<"left" | "right">
}

const HeroBanner = async ({
  imageUrl,
  imageAlt,
  eagerLoadImage,
  isSection,
  overlayPosition,
  children,
  ...props
}: Props) => {
  const BannerWrapper: ElementType = isSection ? "section" : "div"

  return (
    <BannerWrapper {...props} className={twMerge("rs-mb-5 relative @container md:min-h-[400px]", props.className)}>
      <div className="@6xl:aspect-auto relative aspect-[16/9] w-full bg-cool-grey @6xl:absolute @6xl:h-full">
        {imageUrl && (
          <Image
            className="object-cover"
            src={imageUrl}
            alt={imageAlt || ""}
            loading={eagerLoadImage ? "eager" : "lazy"}
            fill
            sizes="100vw"
            {...await getImagePlaceholder(imageUrl)}
          />
        )}
      </div>

      {children && (
        <div
          className={twMerge(
            "rs-p-2 relative flex w-full flex-col gap-10 shadow-lg @6xl:z-10 @6xl:my-24 @6xl:max-w-[550px] @6xl:bg-white",
            clsx({
              "@6xl:ml-auto @6xl:mr-20": overlayPosition === "right",
              "@6xl:ml-20 @6xl:mr-auto": overlayPosition !== "right",
            })
          )}
        >
          {children}
        </div>
      )}
    </BannerWrapper>
  )
}
export default HeroBanner
