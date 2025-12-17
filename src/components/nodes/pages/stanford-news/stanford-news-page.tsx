import {redirect} from "next/navigation"
import Image from "next/image"
import Rows from "@components/paragraphs/rows/rows"
import SocialIcons from "@components/nodes/pages/stanford-news/social-icons"
import {H1} from "@components/elements/headers"
import {HtmlHTMLAttributes} from "react"
import {NodeStanfordNews} from "@lib/gql/__generated__/drupal.d"
import ReverseVisualOrder from "@components/elements/reverse-visual-order"
import NodePageMetadata from "@components/nodes/pages/node-page-metadata"
import {getFirstText} from "@lib/utils/text-tools"
import Wysiwyg from "@components/elements/wysiwyg"
import StanfordNewsSpotlightPage from "@components/nodes/pages/stanford-news/stanford-news-spotlight-page"

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  node: NodeStanfordNews
  headingLevel?: "h2" | "h3"
}

const StanfordNewsPage = ({node, ...props}: Props) => {
  if (node.layoutSelection?.id === "news_spotlight") return <StanfordNewsSpotlightPage node={node} {...props} />

  if (node.suNewsSource?.url) redirect(node.suNewsSource.url)

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
    <article className="centered mt-32" {...props}>
      <NodePageMetadata
        pageTitle={node.title}
        metatags={node.metatag}
        backupDescription={node.suNewsDek || getFirstText(node.suNewsComponents)}
      />
      <div className="mx-auto mb-48 lg:w-10/12">
        <ReverseVisualOrder>
          <H1>{node.title}</H1>

          {topics && <div>{topics.map(topic => topic.name).join(", ")}</div>}
        </ReverseVisualOrder>

        {node.suNewsDek && <div className="mb-10">{node.suNewsDek}</div>}

        <div className="flex items-center gap-5">
          {node.suNewsPublishingDate && (
            <time dateTime={new Date(node.suNewsPublishingDate.time).toISOString().substring(0, 10)}>
              {publishDate}
            </time>
          )}
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
          {node.suNewsBannerMediaCaption && (
            <figcaption className="px-20 text-center">{node.suNewsBannerMediaCaption}</figcaption>
          )}
        </figure>
      )}

      <Wysiwyg html={node.body?.processed} className="centered mb-32 xl:max-w-[980px]" />
      <Rows components={node.suNewsComponents} className="mx-auto lg:w-8/12" />
    </article>
  )
}
export default StanfordNewsPage
