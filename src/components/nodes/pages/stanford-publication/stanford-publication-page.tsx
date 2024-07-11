import Rows from "@components/paragraphs/rows/rows"
import Citation from "@components/nodes/pages/stanford-publication/citation"
import Button from "@components/elements/button"
import {H1} from "@components/elements/headers"
import {HtmlHTMLAttributes} from "react"
import {NodeStanfordPublication} from "@lib/gql/__generated__/drupal.d"
import {redirect} from "next/navigation"

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  node: NodeStanfordPublication
  headingLevel?: "h2" | "h3"
}

const StanfordPublicationPage = ({node, ...props}: Props) => {
  const citationUrl = node.suPublicationCitation?.suUrl?.url
  if (citationUrl) redirect(citationUrl)
  return (
    <article className="centered pt-32" {...props}>
      <div className="flex flex-col gap-10">
        <H1 className="order-2">{node.title}</H1>

        {node.suPublicationTopics && <div className="order-1">{node.suPublicationTopics[0].name}</div>}
      </div>

      <div className="flex flex-col gap-20 lg:flex-row">
        <Rows components={node.suPublicationComponents} className="order-2 flex-grow lg:order-1" />

        <aside className="order-1 flex shrink-0 flex-col gap-10 lg:order-2 lg:w-1/4">
          {node.suPublicationCitation && <Citation citation={node.suPublicationCitation} />}

          {node.suPublicationCta && <Button href={node.suPublicationCta.url}>{node.suPublicationCta.title}</Button>}
        </aside>
      </div>
    </article>
  )
}
export default StanfordPublicationPage
