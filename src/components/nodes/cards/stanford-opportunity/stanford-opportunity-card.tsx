import Link from "@components/elements/link"
import {H2, H3} from "@components/elements/headers"
import {HtmlHTMLAttributes} from "react"
import {NodeStanfordOpportunity} from "@lib/gql/__generated__/graphql"
import ImageCard from "@components/patterns/image-card"
import Wysiwyg from "@components/elements/wysiwyg"
import ReverseVisualOrder from "@components/elements/reverse-visual-order"
import {getIdFromText} from "@lib/utils/text-tools"

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  node: NodeStanfordOpportunity
  headingLevel?: "h2" | "h3"
}

const StanfordOpportunityCard = ({node, headingLevel, ...props}: Props) => {
  const image = node.suOppImage?.mediaImage
  const Heading = headingLevel === "h3" ? H3 : H2
  const id = getIdFromText(node.title)
  return (
    <ImageCard {...props} aria-labelledby={id} imageUrl={image?.url} isArticle>
      <ReverseVisualOrder>
        <Heading className="[&_a]:text-black" id={id}>
          <Link href={node.suOppSource?.url || node.path || "#"}>{node.title}</Link>
        </Heading>
        {node.suOppType && <div>{node.suOppType?.map(type => type.name).join(", ")}</div>}
      </ReverseVisualOrder>
      <Wysiwyg html={node.suOppSummary?.processed || node.body?.summary} />
      {node.suOppCardFooter && <Wysiwyg html={node.suOppCardFooter.processed} />}
      {node.suOppIcon && (
        <div className={`mr-20 text-right text-50 ${node.suOppIcon.style} fa-${node.suOppIcon.iconName}`} />
      )}
    </ImageCard>
  )
}
export default StanfordOpportunityCard
