import Link from "@components/elements/link"
import {CalendarDaysIcon, MapPinIcon} from "@heroicons/react/20/solid"
import Address from "@components/elements/address"
import {H2, H3} from "@components/elements/headers"
import {HtmlHTMLAttributes} from "react"
import {NodeStanfordEvent} from "@lib/gql/__generated__/graphql"
import {getEventTimeString} from "@components/nodes/cards/stanford-event/stanford-event-card"
import cn from "@lib/utils/className"
import ReverseVisualOrder from "@components/elements/reverse-visual-order"
import {getIdFromText} from "@lib/utils/text-tools"

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  node: NodeStanfordEvent
  headingLevel?: "h2" | "h3"
}

const StanfordEventListItem = ({node, headingLevel, ...props}: Props) => {
  const timeZone = node.suEventDateTime.timezone || "America/Los_Angeles"
  const start = new Date(parseInt(node.suEventDateTime.value) * 1000)
  const end = new Date(parseInt(node.suEventDateTime.end_value) * 1000)

  const startMonth = start.toLocaleDateString("en-US", {month: "short", timeZone})
  const startDay = parseInt(start.toLocaleDateString("en-US", {day: "numeric", timeZone}))

  const endMonth = end.toLocaleDateString("en-US", {month: "short", timeZone})
  const endDay = parseInt(end.toLocaleDateString("en-US", {day: "numeric", timeZone}))

  // Fix difference between server side render and client side render. Replace any strange characters.
  const dateTimeString = getEventTimeString(start, end, timeZone).replace(/[^a-zA-Z0-9 ,:\-|]/, " ")
  const Heading = headingLevel === "h3" ? H3 : H2
  const id = getIdFromText(node.title)

  return (
    <article {...props} aria-labelledby={id} className={cn("mx-auto flex w-full gap-20", props.className)}>
      <div aria-hidden="true" className="flex w-fit flex-col items-start">
        <div className="mb-4 w-full text-center type-0 font-semibold">{startMonth.toUpperCase()}</div>
        <div className="w-full text-center type-4 font-bold">{startDay}</div>

        {(startMonth !== endMonth || startDay !== endDay) && (
          <>
            <div className="text-center">&mdash; to &mdash;</div>
            <div className="mb-4 w-full text-center type-0 font-semibold">{endMonth.toUpperCase()}</div>
            <div className="w-full text-center type-4 font-bold">{endDay}</div>
          </>
        )}
      </div>
      <div>
        <ReverseVisualOrder>
          <Heading id={id}>
            <Link
              href={node.suEventSource?.url || node.path || "#"}
              className="text-digital-red no-underline hocus:text-black hocus:underline"
            >
              {node.title}
            </Link>
          </Heading>

          {node.suEventType && <div className="su-digital-red font-semibold">{node.suEventType[0].name}</div>}
        </ReverseVisualOrder>

        {node.suEventSubheadline && <div className="mb-10 type-1 font-semibold">{node.suEventSubheadline}</div>}
        {node.suEventDek && <p>{node.suEventDek}</p>}

        <time className="mb-10 flex items-center gap-10" dateTime={start.toISOString()}>
          <CalendarDaysIcon width={30} className="shrink-0" />
          {dateTimeString}
        </time>

        {node.suEventAltLoc && (
          <div className="flex items-center gap-10">
            <MapPinIcon width={30} className="shrink-0" />
            {node.suEventAltLoc}
          </div>
        )}

        {node.suEventLocation && (
          <div className="flex items-center gap-10">
            <MapPinIcon width={30} className="shrink-0" />
            <Address {...node.suEventLocation} />
          </div>
        )}
      </div>
    </article>
  )
}

export default StanfordEventListItem
