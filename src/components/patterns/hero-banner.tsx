import React, {ElementType, HtmlHTMLAttributes} from "react"
import Image from "next/image"
import cn from "@lib/utils/className"
import {Maybe} from "@lib/gql/__generated__/graphql"
import {getImagePlaceholder} from "@lib/utils/get-image-placeholder"
import {OverlayColors} from "@lib/@types/drupal"

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
  overlayPosition?: Maybe<"left" | "right" | "center">
  /**
   * Position of the text over the image.
   */
  overlayColor?: OverlayColors
}

const HeroBanner = async ({
  imageUrl,
  imageAlt,
  eagerLoadImage,
  isSection,
  overlayPosition,
  overlayColor,
  children,
  ...props
}: Props) => {
  const BannerWrapper: ElementType = isSection ? "section" : "div"

  return (
    <BannerWrapper {...props} className={cn("@container relative rs-mb-5 md:min-h-400", props.className)}>
      <div
        className={cn("w-full bg-cool-grey", {
          "relative aspect-video @6xl:absolute @6xl:aspect-auto @6xl:h-full": overlayPosition !== "center",
          "absolute aspect-auto h-full": overlayPosition === "center",
        })}
      >
        {overlayPosition === "center" && (
          <div
            className={cn("relative z-10 size-full", {
              "bg-black-true/80": !overlayColor || overlayColor === "#000000",
              "bg-plum/80": overlayColor === "#620059",
              "bg-sky-dark/80": overlayColor === "#016895",
              "bg-lagunita-dark/80": overlayColor === "#006B81",
              "bg-palo-alto/80": overlayColor === "#175E54",
              "bg-stone-dark/80": overlayColor === "#544948",
            })}
          />
        )}
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
          className={cn("relative z-11 flex size-full flex-col gap-20", {
            "cc items-center justify-center rs-py-4 text-center text-white @6xl:max-w-800":
              overlayPosition === "center",
            "rs-p-2 shadow-lg @6xl:z-10 @6xl:my-48 @6xl:max-w-550 @6xl:bg-white": overlayPosition !== "center",
            "@6xl:mr-40 @6xl:ml-auto": overlayPosition === "right",
            "@6xl:mr-auto @6xl:ml-40": overlayPosition === "left",
          })}
        >
          {children}
        </div>
      )}
    </BannerWrapper>
  )
}
export default HeroBanner
