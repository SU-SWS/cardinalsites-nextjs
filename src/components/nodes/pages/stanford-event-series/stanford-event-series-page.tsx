import StanfordEventListItem from "@components/nodes/list-item/stanford-event/stanford-event-list-item"
import {H1} from "@components/elements/headers"
import {HtmlHTMLAttributes} from "react"
import {NodeStanfordEvent, NodeStanfordEventSeries} from "@lib/gql/__generated__/drupal.d"

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  node: NodeStanfordEventSeries
  headingLevel?: "h2" | "h3"
}

const StanfordEventSeriesPage = ({node, ...props}: Props) => {
  return (
    <article className="centered" {...props}>
      <H1 className="mt-32">{node.title}</H1>

      {node.suEventSeriesDek && <div className="type-4 mb-20 font-bold">{node.suEventSeriesDek}</div>}
      {node.suEventSeriesSubheadline && <div>{node.suEventSeriesSubheadline}</div>}
      {node.suEventSeriesEvent && (
        <div className="mb-20">
          {node.suEventSeriesEvent.map(event => (
            <div key={event.id} className="border-b border-black-20 py-20 last:border-0">
              <StanfordEventListItem node={event as NodeStanfordEvent} />
            </div>
          ))}
        </div>
      )}
    </article>
  )
}
export default StanfordEventSeriesPage
