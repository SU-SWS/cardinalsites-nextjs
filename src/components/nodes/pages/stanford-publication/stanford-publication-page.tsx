import Rows from "@components/paragraphs/rows/rows"
import Citation from "@components/nodes/pages/stanford-publication/citation"
import Button from "@components/elements/button"
import {H1} from "@components/elements/headers"
import {HtmlHTMLAttributes} from "react"
import {NodeStanfordPublication} from "@lib/gql/__generated__/graphql"
import {redirect} from "next/navigation"
import ReverseVisualOrder from "@components/elements/reverse-visual-order"
import NodePageMetadata from "@components/nodes/pages/node-page-metadata"
import {getFirstText} from "@lib/utils/text-tools"

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  node: NodeStanfordPublication
}

const StanfordPublicationPage = ({node, ...props}: Props) => {
  const citationUrl = node.suPublicationCitation?.suUrl?.url

  if (citationUrl) redirect(citationUrl)
  return (
    <article className="centered mb-20 pt-32" {...props}>
      <NodePageMetadata
        pageTitle={node.title}
        metatags={node.metatag}
        backupDescription={getFirstText(node.suPublicationComponents)}
      />
      <ReverseVisualOrder className="gap-10">
        <H1>{node.title}</H1>
        <div>
          {node.suPublicationCitation?.__typename === "CitationSuArticleNewspaper" && "Article Newspaper/Magazine "}
          {node.suPublicationCitation?.__typename === "CitationSuArticleJournal" && "Journal Article "}
          {node.suPublicationCitation?.__typename === "CitationSuBook" && "Book"}
          {node.suPublicationCitation?.__typename === "CitationSuThesi" && "Thesis"}
          {node.suPublicationCitation?.__typename === "CitationSuOther" && "Publication"}
        </div>
      </ReverseVisualOrder>

      <div className="mb-20 flex flex-col gap-20 lg:flex-row">
        <Rows components={node.suPublicationComponents} className="order-2 flex-grow lg:order-1" />

        <aside className="order-1 ml-auto flex h-fit shrink-0 flex-col gap-10 border-l border-black-20 pl-20 lg:order-2 lg:w-1/4">
          {node.suPublicationCitation && <Citation citation={node.suPublicationCitation} />}

          {node.suPublicationCta && <Button href={node.suPublicationCta.url}>{node.suPublicationCta.title}</Button>}
        </aside>
      </div>

      {node.suPublicationTopics && (
        <div className="border-t border-black-20 pt-10">
          <strong>Related Topics</strong>
          <br />
          {node.suPublicationTopics.map(topic => topic.name).join(", ")}
        </div>
      )}
    </article>
  )
}
export default StanfordPublicationPage
