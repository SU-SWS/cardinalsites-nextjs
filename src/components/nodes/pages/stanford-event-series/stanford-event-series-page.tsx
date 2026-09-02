import StanfordEventListItem from "@components/nodes/list-item/stanford-event/stanford-event-list-item"
import {H1} from "@components/elements/headers"
import {HtmlHTMLAttributes} from "react"
import {NodeStanfordEventSeries} from "@lib/gql/__generated__/graphql"

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  node: NodeStanfordEventSeries
}

const StanfordEventSeriesPage = ({node, ...props}: Props) => {
  return (
    <article className="centered" {...props}>
      <H1 className="mt-64">{node.title}</H1>

      {node.suEventSeriesDek && <div className="mb-40 type-4 font-bold">{node.suEventSeriesDek}</div>}
      {node.suEventSeriesSubheadline && <div>{node.suEventSeriesSubheadline}</div>}
      {node.suEventSeriesEvent && (
        <div className="mb-40">
          {node.suEventSeriesEvent.map(event => (
            <div key={event.uuid} className="border-b border-black-20 py-40 last:border-0">
              <StanfordEventListItem node={event} />
            </div>
          ))}
        </div>
      )}
    </article>
  )
}
export default StanfordEventSeriesPage
