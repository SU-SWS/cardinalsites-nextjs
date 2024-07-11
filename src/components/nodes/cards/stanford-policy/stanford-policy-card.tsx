import Link from "@components/elements/link"
import Wysiwyg from "@components/elements/wysiwyg"
import {H2, H3} from "@components/elements/headers"
import {HtmlHTMLAttributes} from "react"
import {NodeStanfordPolicy} from "@lib/gql/__generated__/drupal.d"
import ImageCard from "@components/patterns/image-card"

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  node: NodeStanfordPolicy
  headingLevel?: "h2" | "h3"
}

const StanfordPolicyCard = ({node, headingLevel, ...props}: Props) => {
  const Heading = headingLevel === "h3" ? H3 : H2
  const trimmedBodyText = node.body?.processed
    .replace(/(<([^>]+)>)/gi, " ")
    .split(" ")
    .slice(0, 50)
    .filter((word: string) => !!word)
    .join(" ")

  const teaserSummary = node.body?.summary || trimmedBodyText + "..."
  return (
    <ImageCard {...props} aria-labelledby={node.id} isArticle>
      <Heading className="text-m2" id={node.id}>
        <Link href={node.path}>{node.title}</Link>
      </Heading>

      {teaserSummary && <Wysiwyg html={teaserSummary} />}
    </ImageCard>
  )
}
export default StanfordPolicyCard
