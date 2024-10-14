import Link from "@components/elements/link"
import {H2, H3} from "@components/elements/headers"
import {HtmlHTMLAttributes} from "react"
import {NodeStanfordPolicy} from "@lib/gql/__generated__/drupal.d"

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  node: NodeStanfordPolicy
  headingLevel?: "h2" | "h3"
}

const StanfordPolicyListItem = ({node, headingLevel, ...props}: Props) => {
  const Heading = headingLevel === "h3" ? H3 : H2
  return (
    <article {...props} aria-labelledby={node.id}>
      <Heading id={node.id}>
        <Link href={node.path}>{node.title}</Link>
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
