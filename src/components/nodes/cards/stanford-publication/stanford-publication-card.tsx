import Link from "@components/elements/link"
import {H2, H3} from "@components/elements/headers"
import {HtmlHTMLAttributes} from "react"
import {NodeStanfordPublication} from "@lib/gql/__generated__/graphql"
import ImageCard from "@components/patterns/image-card"
import ReverseVisualOrder from "@components/elements/reverse-visual-order"
import {getIdFromText} from "@lib/utils/text-tools"

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  node: NodeStanfordPublication
  headingLevel?: "h2" | "h3"
}

const StanfordPublicationCard = ({node, headingLevel, ...props}: Props) => {
  const citationUrl = node.suPublicationCitation?.suUrl?.url
  const Heading = headingLevel === "h3" ? H3 : H2
  const citationTypes: Record<string, string> = {
    CitationSuArticleNewspaper: "Article Newspaper/Magazine",
    CitationSuArticleJournal: "Journal Article",
    CitationSuBook: "Book",
    CitationSuThesi: "Thesis",
  }
  const id = getIdFromText(node.title)
  return (
    <ImageCard {...props} aria-labelledby={id} isArticle>
      <ReverseVisualOrder>
        <Heading className="[&_a]:text-black [&_a]:hocus:text-digital-red" id={id}>
          <Link href={citationUrl || node.path || "#"}>{node.title}</Link>
        </Heading>
        <div className="font-bold">
          {node.suPublicationCitation?.__typename &&
          typeof citationTypes[node.suPublicationCitation?.__typename] !== "undefined"
            ? citationTypes[node.suPublicationCitation?.__typename]
            : "Publication"}
        </div>
      </ReverseVisualOrder>

      {node.suPublicationTopics && (
        <div>
          {node.suPublicationTopics.map(topic => (
            <div key={topic.uuid}>{topic.name}</div>
          ))}
        </div>
      )}
    </ImageCard>
  )
}
export default StanfordPublicationCard
