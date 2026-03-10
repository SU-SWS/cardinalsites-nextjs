import Link from "@components/elements/link"
import {H2, H3} from "@components/elements/headers"
import {HtmlHTMLAttributes} from "react"
import {NodeStanfordPolicy} from "@lib/gql/__generated__/graphql"
import {getIdFromText} from "@lib/utils/text-tools"

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  node: NodeStanfordPolicy
  headingLevel?: "h2" | "h3"
}

const StanfordPolicyListItem = ({node, headingLevel, ...props}: Props) => {
  const Heading = headingLevel === "h3" ? H3 : H2
  const id = getIdFromText(node.title)
  return (
    <article {...props} aria-labelledby={id}>
      <Heading id={id}>
        <Link href={node.suPolicySource?.url || node.path || "#"}>{node.title}</Link>
      </Heading>
      {node.suPolicyUpdated && (
        <div className="mb-5">
          <strong>Last Updated: </strong>
          {new Date(node.suPolicyUpdated.time).toLocaleDateString("en-us", {
            month: "long",
            day: "numeric",
            year: "numeric",
            timeZone: node.suPolicyUpdated.timezone,
          })}
        </div>
      )}

      {node.body?.summary && <p>{node.body.summary}</p>}
    </article>
  )
}
export default StanfordPolicyListItem
