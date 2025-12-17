import {redirect} from "next/navigation"
import Image from "next/image"
import Rows from "@components/paragraphs/rows/rows"
import {H1} from "@components/elements/headers"
import {HtmlHTMLAttributes} from "react"
import {NodeStanfordNews} from "@lib/gql/__generated__/drupal.d"
import ReverseVisualOrder from "@components/elements/reverse-visual-order"
import NodePageMetadata from "@components/nodes/pages/node-page-metadata"
import {getFirstText} from "@lib/utils/text-tools"
import Wysiwyg from "@components/elements/wysiwyg"

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  node: NodeStanfordNews
  headingLevel?: "h2" | "h3"
}

const StanfordNewsSpotlightPage = ({node, ...props}: Props) => {
  if (node.suNewsSource?.url) redirect(node.suNewsSource.url)

  const publishDate = node.suNewsPublishingDate
    ? new Date(node.suNewsPublishingDate.time).toLocaleDateString("en-us", {
        month: "long",
        day: "numeric",
        year: "numeric",
        timeZone: node.suNewsPublishingDate.timezone,
      })
    : undefined

  const imageUrl = node.suNewsFeaturedMedia?.mediaImage.url
  const imageAlt = node.suNewsFeaturedMedia?.mediaImage.alt || ""

  return (
    <article className="centered mt-32" {...props}>
      <NodePageMetadata
        pageTitle={node.title}
        metatags={node.metatag}
        backupDescription={node.suNewsDek || getFirstText(node.suNewsComponents)}
      />
      <div className="mx-auto mb-10">
        <div className="mb-20 flex flex-row-reverse items-start gap-20">
          <div className="w-9/12">
            <ReverseVisualOrder>
              <H1>{node.title}</H1>
              <div>Spotlight</div>
            </ReverseVisualOrder>

            {node.suNewsQuote && <div className="mb-10">{node.suNewsQuote}</div>}
          </div>

          {imageUrl && (
            <figure className="w-3/12">
              <div className="relative aspect-1 w-full">
                <Image
                  className="object-cover"
                  src={imageUrl}
                  alt={imageAlt}
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
        </div>

        <div className="flex items-center gap-5">
          {node.suNewsPublishingDate && (
            <time dateTime={new Date(node.suNewsPublishingDate.time).toISOString().substring(0, 10)}>
              {publishDate}
            </time>
          )}
          {node.suNewsByline && <div>{node.suNewsByline}</div>}
        </div>
      </div>

      <Wysiwyg html={node.body?.processed} className="centered mb-32" />
      <Rows components={node.suNewsComponents} />
    </article>
  )
}
export default StanfordNewsSpotlightPage
