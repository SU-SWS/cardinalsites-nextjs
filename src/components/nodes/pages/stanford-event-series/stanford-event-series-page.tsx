import StanfordEventListItem from "@components/nodes/list-item/stanford-event/stanford-event-list-item"
import {H1} from "@components/elements/headers"
import {HtmlHTMLAttributes} from "react"
import {NodeStanfordEventSeries} from "@lib/gql/__generated__/graphql"
import NodePageMetadata from "@components/nodes/pages/node-page-metadata"
import {getFirstText} from "@lib/utils/text-tools"

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  node: NodeStanfordEventSeries
}

const StanfordEventSeriesPage = ({node, ...props}: Props) => {
  return (
    <article className="centered" {...props}>
      <NodePageMetadata
        pageTitle={node.title}
        metatags={node.metatag}
        backupDescription={node.suEventSeriesSubheadline || getFirstText(node.suEventSeriesComponents)}
      />
      <H1 className="mt-32">{node.title}</H1>

      {node.suEventSeriesDek && <div className="type-4 mb-20 font-bold">{node.suEventSeriesDek}</div>}
      {node.suEventSeriesSubheadline && <div>{node.suEventSeriesSubheadline}</div>}
      {node.suEventSeriesEvent && (
        <div className="mb-20">
          {node.suEventSeriesEvent.map(event => (
            <div key={event.uuid} className="border-b border-black-20 py-20 last:border-0">
              <StanfordEventListItem node={event} />
            </div>
          ))}
        </div>
      )}
    </article>
  )
}
export default StanfordEventSeriesPage
