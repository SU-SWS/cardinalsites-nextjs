import Link from "@components/elements/link"
import {H2, H3} from "@components/elements/headers"
import {HtmlHTMLAttributes} from "react"
import {NodeStanfordNews} from "@lib/gql/__generated__/drupal.d"
import ImageCard from "@components/patterns/image-card"
import ReverseVisualOrder from "@components/elements/reverse-visual-order"

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  node: NodeStanfordNews
  headingLevel?: "h2" | "h3"
}

const StanfordNewsCard = ({node, headingLevel, ...props}: Props) => {
  const image = node.suNewsFeaturedMedia?.mediaImage

  const topics = node.suNewsTopics?.slice(0, 3) || []
  const Heading = headingLevel === "h3" ? H3 : H2

  const publishDate = node.suNewsPublishingDate?.time
    ? new Date(node.suNewsPublishingDate.time).toLocaleDateString("en-us", {
        month: "long",
        day: "numeric",
        year: "numeric",
        timeZone: node.suNewsPublishingDate.timezone,
      })
    : undefined

  return (
    <ImageCard {...props} aria-labelledby={node.id} imageUrl={image?.url} isArticle>
      <ReverseVisualOrder>
        <Heading className="[&_a]:text-black" id={node.id}>
          <Link href={node.suNewsSource?.url || node.path}>{node.title}</Link>
        </Heading>

        {publishDate && <div>{publishDate}</div>}
      </ReverseVisualOrder>

      {node.suNewsDek && <div>{node.suNewsDek}</div>}

      {topics && <div>{topics.map(topic => topic.name).join(", ")}</div>}
    </ImageCard>
  )
}
export default StanfordNewsCard
