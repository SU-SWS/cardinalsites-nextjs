import Link from "@components/elements/link"
import {H2, H3} from "@components/elements/headers"
import {HtmlHTMLAttributes} from "react"
import {NodeStanfordEventSeries} from "@lib/gql/__generated__/graphql"
import cn from "@lib/utils/className"
import {getIdFromText} from "@lib/utils/text-tools"

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  node: NodeStanfordEventSeries
  headingLevel?: "h2" | "h3"
}

const StanfordEventSeriesListItem = ({node, headingLevel, ...props}: Props) => {
  const Heading = headingLevel === "h3" ? H3 : H2
  const id = getIdFromText(node.title)
  return (
    <article
      {...props}
      aria-labelledby={id}
      className={cn("mx-auto w-full max-w-500 border border-black-20 p-20 shadow-xl", props.className)}
    >
      <Heading id={id}>
        <Link href={node.path || "#"}>{node.title}</Link>
      </Heading>
    </article>
  )
}
export default StanfordEventSeriesListItem
