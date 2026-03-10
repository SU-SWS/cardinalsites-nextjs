import Link from "@components/elements/link"
import Image from "next/image"
import {H2, H3} from "@components/elements/headers"
import {HtmlHTMLAttributes} from "react"
import {NodeStanfordPage} from "@lib/gql/__generated__/graphql"
import twMerge from "@lib/utils/twMerge"
import {getIdFromText} from "@lib/utils/text-tools"

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  node: NodeStanfordPage
  headingLevel?: "h2" | "h3"
}

const StanfordPageListItem = ({node, headingLevel, ...props}: Props) => {
  const pageTitleBannerImage =
    node.suPageBanner?.__typename === "ParagraphStanfordPageTitleBanner" &&
    node.suPageBanner.suTitleBannerImage.mediaImage
  const bannerImage =
    node.suPageBanner?.__typename === "ParagraphStanfordBanner" && node.suPageBanner.suBannerImage?.mediaImage
  const image = node.suPageImage?.mediaImage || pageTitleBannerImage || bannerImage

  const Heading = headingLevel === "h3" ? H3 : H2
  const id = getIdFromText(node.title)
  return (
    <article {...props} aria-labelledby={id} className={twMerge("@container", props.className)}>
      <div className="flex flex-col justify-between gap-20 @4xl:flex-row" {...props}>
        <div className="order-2 @4xl:order-1">
          <Heading id={id}>
            <Link href={node.path || "#"}>{node.title}</Link>
          </Heading>

          {node.suPageDescription && <p>{node.suPageDescription}</p>}
        </div>

        {image && (
          <div className="order-1 w-full shrink-0 @3xl:w-1/4">
            <div className="relative mb-10 aspect-[16/9] @3xl:order-2 @3xl:mb-0">
              <Image
                className="object-cover"
                src={image.url}
                alt={image.alt || ""}
                fill
                sizes="(max-width: 768px) 100vw, 1000px"
              />
            </div>
          </div>
        )}
      </div>
    </article>
  )
}
export default StanfordPageListItem
