import Link from "@components/elements/link"
import {H2, H3} from "@components/elements/headers"
import {HtmlHTMLAttributes} from "react"
import {NodeStanfordEventSeries} from "@lib/gql/__generated__/drupal.d"
import {twMerge} from "tailwind-merge"

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  node: NodeStanfordEventSeries
  headingLevel?: "h2" | "h3"
}

const StanfordEventSeriesListItem = ({node, headingLevel, ...props}: Props) => {
  const Heading = headingLevel === "h3" ? H3 : H2
  return (
    <article
      {...props}
      aria-labelledby={node.id}
      className={twMerge("mx-auto w-full max-w-[500px] border border-black-20 p-10 shadow-xl", props.className)}
    >
      <Heading className="type-3" id={node.id}>
        <Link href={node.path}>{node.title}</Link>
      </Heading>
    </article>
  )
}
export default StanfordEventSeriesListItem
