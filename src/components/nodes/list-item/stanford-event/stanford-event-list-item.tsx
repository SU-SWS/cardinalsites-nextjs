import Link from "@components/elements/link"
import {CalendarDaysIcon, MapPinIcon} from "@heroicons/react/20/solid"
import Address from "@components/elements/address"
import {H2, H3} from "@components/elements/headers"
import {HtmlHTMLAttributes} from "react"
import {NodeStanfordEvent} from "@lib/gql/__generated__/drupal.d"
import {getEventTimeString} from "@components/nodes/cards/stanford-event/stanford-event-card"
import {twMerge} from "tailwind-merge"

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  node: NodeStanfordEvent
  headingLevel?: "h2" | "h3"
}

const StanfordEventListItem = ({node, headingLevel, ...props}: Props) => {
  const timeZone = node.suEventDateTime.timezone || "America/Los_Angeles"
  const start = new Date(node.suEventDateTime.value * 1000)
  const end = new Date(node.suEventDateTime.end_value * 1000)

  const startMonth = start.toLocaleDateString("en-US", {month: "short", timeZone})
  const startDay = parseInt(start.toLocaleDateString("en-US", {day: "numeric", timeZone}))

  // Fix difference between server side render and client side render. Replace any strange characters.
  const dateTimeString = getEventTimeString(start, end, timeZone).replace(/[^a-zA-Z0-9 ,:\-|]/, " ")
  const Heading = headingLevel === "h3" ? H3 : H2

  return (
    <article
      {...props}
      aria-labelledby={node.id}
      className={twMerge("mx-auto flex w-full gap-10 py-10", props.className)}
    >
      <div aria-hidden className="flex w-fit flex-col items-start">
        <div className="mb-4 w-full text-center text-m0 font-semibold">{startMonth.toUpperCase()}</div>
        <div className="w-full text-center text-m4 font-bold">{startDay}</div>
      </div>
      <div>
        <div className="flex flex-col">
          <Heading className="text-m2" id={node.id}>
            <Link
              href={node.suEventSource?.url || node.path}
              className="text-digital-red no-underline hocus:text-black hocus:underline"
            >
              {node.title}
            </Link>
          </Heading>

          {node.suEventType && <div className="su-digital-red order-first">{node.suEventType[0].name}</div>}
        </div>

        {node.suEventSubheadline && <div className="mb-5 text-m1 font-bold">{node.suEventSubheadline}</div>}
        {node.suEventDek && <p>{node.suEventDek}</p>}

        <time className="mb-5 flex items-center gap-5" dateTime={start.toISOString()}>
          <CalendarDaysIcon width={30} className="shrink-0" />
          {dateTimeString}
        </time>

        {node.suEventLocation && (
          <div>
            <div className="flex items-center gap-5">
              <MapPinIcon width={30} className="shrink-0" />
              <Address {...node.suEventLocation} />
            </div>
          </div>
        )}

        {node.suEventAltLoc && (
          <div className="flex items-center gap-5">
            <MapPinIcon width={30} className="shrink-0" />
            {node.suEventAltLoc}
          </div>
        )}
      </div>
    </article>
  )
}

export default StanfordEventListItem
