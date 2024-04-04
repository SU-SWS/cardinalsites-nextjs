import React, {ElementType, HtmlHTMLAttributes} from "react";
import Image from "next/image";
import {twMerge} from "tailwind-merge";
import {Maybe} from "@lib/gql/__generated__/drupal";

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
  isSection?:Maybe<boolean>
  /**
   * Eagerly load the banner image.
   */
  eagerLoadImage?: Maybe<boolean>
  /**
   * Position of the text over the image.
   */
  overlayPosition?: Maybe<"left" | "right">
}

const HeroBanner = ({imageUrl, imageAlt, eagerLoadImage, isSection, overlayPosition, children, ...props}: Props) => {
  const BannerWrapper: ElementType = isSection ? "section" : "div";

  return (
    <BannerWrapper
      {...props}
      className={twMerge("@container md:min-h-[400px] rs-mb-5", props.className)}
    >
      <div className="aspect-[16/9] @6xl:aspect-auto relative @6xl:absolute w-full @6xl:h-full bg-cool-grey">
        {imageUrl &&
          <Image
            className="object-cover"
            src={imageUrl}
            alt={imageAlt || ""}
            loading={eagerLoadImage ? "eager" : "lazy"}
            fill
            sizes="100vw"
          />
        }
      </div>

      {children &&
        <div className={twMerge("w-full relative shadow-lg flex flex-col gap-10 rs-p-2 @6xl:bg-white @6xl:max-w-[550px] @6xl:my-24 @6xl:z-10", overlayPosition === "right" ? "@6xl:ml-auto @6xl:mr-20" : "@6xl:mr-auto @6xl:ml-20")}>
          {children}
        </div>
      }
    </BannerWrapper>
  )
}
export default HeroBanner