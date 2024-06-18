import {redirect} from "next/navigation"
import Image from "next/image"
import Rows from "@components/paragraphs/rows/rows"
import SocialIcons from "@components/nodes/pages/stanford-news/social-icons"
import {H1} from "@components/elements/headers"
import {HtmlHTMLAttributes} from "react"
import {NodeStanfordNews} from "@lib/gql/__generated__/drupal.d"
import {isPreviewMode} from "@lib/drupal/is-preview-mode"

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  node: NodeStanfordNews
  headingLevel?: "h2" | "h3"
}

const StanfordNewsPage = ({node, ...props}: Props) => {
  if (node.suNewsSource?.url && !isPreviewMode()) redirect(node.suNewsSource.url)

  const publishDate = node.suNewsPublishingDate
    ? new Date(node.suNewsPublishingDate.time).toLocaleDateString("en-us", {
        month: "long",
        day: "numeric",
        year: "numeric",
        timeZone: node.suNewsPublishingDate.timezone,
      })
    : undefined

  let bannerImageUrl: string | undefined,
    bannerImageAlt: string = ""
  if (node.suNewsBanner?.__typename === "MediaImage") {
    bannerImageUrl = node.suNewsBanner.mediaImage.url
    bannerImageAlt = node.suNewsBanner.mediaImage.alt || ""
  }

  const topics = node.suNewsTopics?.slice(0, 3)

  return (
    <article
      className="centered mt-32"
      {...props}
    >
      <div className="mx-auto mb-48 lg:w-10/12">
        <div className="flex flex-col">
          <H1 className="order-2">{node.title}</H1>

          {topics && <div className="order-1 flex gap-2">{topics.map(topic => topic.name).join(", ")}</div>}
        </div>

        {node.suNewsDek && <div className="mb-10">{node.suNewsDek}</div>}

        <div className="flex items-center gap-5">
          {node.suNewsPublishingDate && <time dateTime={new Date(node.suNewsPublishingDate.time).toISOString().substring(0, 10)}>{publishDate}</time>}
          {node.suNewsByline && <div>{node.suNewsByline}</div>}

          {!node.suNewsHideSocial && <SocialIcons className="flex gap-4" />}
        </div>
      </div>

      {bannerImageUrl && (
        <figure className="mb-32">
          <div className="relative aspect-[16/9] w-full">
            <Image
              className="object-cover"
              src={bannerImageUrl}
              alt={bannerImageAlt}
              loading="eager"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 900px) 75vw, 1000px"
            />
          </div>
          {node.suNewsBannerMediaCaption && <figcaption className="px-20 text-center">{node.suNewsBannerMediaCaption}</figcaption>}
        </figure>
      )}

      <Rows
        components={node.suNewsComponents}
        className="mx-auto lg:w-8/12"
      />
    </article>
  )
}
export default StanfordNewsPage
