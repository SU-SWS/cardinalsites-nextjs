import React, {HtmlHTMLAttributes} from "react";
import {ParagraphStanfordPageTitleBanner} from "@lib/gql/__generated__/drupal.d";
import Image from "next/image";
import {H1} from "@components/elements/headers";

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  paragraph: ParagraphStanfordPageTitleBanner
  pageTitle: string
}

const PageTitleBannerParagraph = ({paragraph, pageTitle, ...props}: Props) => {

  return (
    <div {...props}>
      <div className="@container md:min-h-[400px] mb-20">
        <div
          className="aspect-[16/9] @6xl:aspect-auto relative @6xl:absolute w-full @6xl:h-full bg-cool-grey">
          {paragraph.suTitleBannerImage?.mediaImage.url &&
            <Image
              className="object-cover"
              src={paragraph.suTitleBannerImage.mediaImage.url}
              alt={paragraph.suTitleBannerImage.mediaImage.alt || ""}
              loading="eager"
              fill
              sizes="100vw"
            />
          }
        </div>


        <div
          className="w-full relative shadow-lg flex flex-col gap-10 py-20 px-10 @6xl:bg-white @6xl:max-w-[550px] @6xl:my-20 @6xl:ml-20 @6xl:z-10">

          <H1 className="order-2 text-m2 p-0 m-0 mb-[-10px]">
            {pageTitle}
          </H1>

        </div>
      </div>
    </div>
  )
}
export default PageTitleBannerParagraph