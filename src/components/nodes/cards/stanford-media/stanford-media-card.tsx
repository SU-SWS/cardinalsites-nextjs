import Link from "@components/elements/link"
import {H2, H3} from "@components/elements/headers"
import {HtmlHTMLAttributes} from "react"
import {NodeStanfordMedia} from "@lib/gql/__generated__/graphql"
import ImageCard from "@components/patterns/image-card"
import ReverseVisualOrder from "@components/elements/reverse-visual-order"
import {getIdFromText} from "@lib/utils/text-tools"

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  node: NodeStanfordMedia
  headingLevel?: "h2" | "h3"
}

const StanfordMediaCard = ({node, headingLevel, ...props}: Props) => {
  const image = node.suMediaImage?.mediaImage

  const topics = node.suMediaTypes?.slice(0, 3) || []
  const Heading = headingLevel === "h3" ? H3 : H2

  const publishDate = node.suMediaDate?.time
    ? new Date(node.suMediaDate.time).toLocaleDateString("en-us", {
        month: "long",
        day: "numeric",
        year: "numeric",
        timeZone: node.suMediaDate.timezone,
      })
    : undefined
  const id = getIdFromText(node.title)
  return (
    <ImageCard {...props} aria-labelledby={id} imageUrl={image?.url} isArticle>
      <ReverseVisualOrder>
        <Heading className="[&_a]:text-black" id={id}>
          <Link href={node.suMediaSource?.url || node.path || "#"}>{node.title}</Link>
        </Heading>

        {publishDate && <div>{publishDate}</div>}
      </ReverseVisualOrder>

      {node.suMediaDek && <div>{node.suMediaDek}</div>}

      {!!topics.length && <div>{topics.map(topic => topic.name).join(", ")}</div>}
    </ImageCard>
  )
}
export default StanfordMediaCard
