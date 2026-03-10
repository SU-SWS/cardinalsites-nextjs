import Link from "@components/elements/link"
import Wysiwyg from "@components/elements/wysiwyg"
import {H2, H3} from "@components/elements/headers"
import {HtmlHTMLAttributes} from "react"
import {NodeStanfordPolicy} from "@lib/gql/__generated__/graphql"
import ImageCard from "@components/patterns/image-card"
import {getIdFromText} from "@lib/utils/text-tools"

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  node: NodeStanfordPolicy
  headingLevel?: "h2" | "h3"
}

const StanfordPolicyCard = ({node, headingLevel, ...props}: Props) => {
  const Heading = headingLevel === "h3" ? H3 : H2
  const trimmedBodyText = node.body?.processed
    ?.replace(/(<([^>]+)>)/gi, " ")
    .split(" ")
    .slice(0, 50)
    .filter((word: string) => !!word)
    .join(" ")

  const teaserSummary = node.body?.summary || trimmedBodyText + "..."
  const id = getIdFromText(node.title)
  return (
    <ImageCard {...props} aria-labelledby={id} isArticle>
      <Heading id={id}>
        <Link href={node.suPolicySource?.url || node.path || "#"}>{node.title}</Link>
      </Heading>

      {teaserSummary && <Wysiwyg html={teaserSummary} />}
    </ImageCard>
  )
}
export default StanfordPolicyCard
