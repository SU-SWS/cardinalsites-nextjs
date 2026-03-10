import {HtmlHTMLAttributes} from "react"
import {NodeStanfordPublication} from "@lib/gql/__generated__/graphql"
import Wysiwyg from "@components/elements/wysiwyg"
import Link from "@components/elements/link"

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  node: NodeStanfordPublication
  apa?: boolean
  chicago?: boolean
}

const StanfordPublicationListItem = ({node, apa, chicago, ...props}: Props) => {
  const citation = apa ? node.suPublicationCitation?.apa : node.suPublicationCitation?.chicago

  return (
    <div {...props}>
      {citation && (
        <Wysiwyg
          html={citation}
          className="ml-12 -indent-12 [&_a]:text-digital-red [&_a]:no-underline [&_a]:hocus:text-black [&_a]:hocus:underline"
        />
      )}
      {!citation && (
        <Link
          className="text-digital-red no-underline hocus:text-black hocus:underline"
          href={node.path || "#"}
          prefetch={false}
        >
          {node.title}
        </Link>
      )}
    </div>
  )
}
export default StanfordPublicationListItem
