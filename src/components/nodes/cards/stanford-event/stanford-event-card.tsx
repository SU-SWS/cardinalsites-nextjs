import Link from "@components/elements/link"
import {CalendarDaysIcon, MapPinIcon} from "@heroicons/react/20/solid"
import {H2, H3} from "@components/elements/headers"
import {HtmlHTMLAttributes} from "react"
import {NodeStanfordEvent} from "@lib/gql/__generated__/drupal.d"
import Address from "@components/elements/address"
import ImageCard from "@components/patterns/image-card"
import ReverseVisualOrder from "@components/elements/reverse-visual-order"

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  node: NodeStanfordEvent
  headingLevel?: "h2" | "h3"
}

const StanfordEventCard = ({node, headingLevel, ...props}: Props) => {
  const timeZone = node.suEventDateTime.timezone || "America/Los_Angeles"

  const start = new Date(node.suEventDateTime.value * 1000)
  const end = new Date(node.suEventDateTime.end_value * 1000)

  const startMonth = start.toLocaleDateString("en-US", {month: "short", timeZone})
  const startDay = parseInt(start.toLocaleDateString("en-US", {day: "numeric", timeZone}))

  const endMonth = end.toLocaleDateString("en-US", {month: "short", timeZone})
  const endDay = parseInt(end.toLocaleDateString("en-US", {day: "numeric", timeZone}))

  // Fix difference between server side render and client side render. Replace any strange characters.
  const dateTimeString = getEventTimeString(start, end, timeZone).replace(/[^a-zA-Z0-9 ,:\-|]/, " ")
  const Heading = headingLevel === "h3" ? H3 : H2
  return (
    <ImageCard {...props} aria-labelledby={node.id} isArticle>
      <div aria-hidden className="flex max-w-lg items-center justify-between">
        <div className="flex w-fit flex-col items-start">
          <div className="type-0 mb-2 w-full text-center font-semibold">{startMonth.toUpperCase()}</div>
          <div className="type-4 w-full text-center font-bold">{startDay}</div>
        </div>

        {(startMonth !== endMonth || startDay !== endDay) && (
          <>
            <div className="mx-2">&mdash; to &mdash;</div>
            <div aria-hidden className="flex w-fit flex-col items-start">
              <div className="type-0 mb-2 w-full text-center font-semibold">{endMonth.toUpperCase()}</div>
              <div className="type-4 w-full text-center font-bold">{endDay}</div>
            </div>
          </>
        )}
      </div>

      <ReverseVisualOrder>
        <Heading className="[&_a]:text-black [&_a]:hocus:text-digital-red" id={node.id}>
          <Link href={node.suEventSource?.url || node.path}>{node.title}</Link>
        </Heading>

        {node.suEventType && <div className="su-digital-red">{node.suEventType[0].name}</div>}
      </ReverseVisualOrder>

      {node.suEventSubheadline && <div className="type-2 mb-5 font-bold">{node.suEventSubheadline}</div>}

      <time className="flex items-center gap-5" dateTime={start.toISOString()}>
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
    </ImageCard>
  )
}

export const getEventTimeString = (start: Date, end: Date, timeZone: string): string => {
  const startHour = parseInt(
    start.toLocaleTimeString("en-US", {
      hour: "numeric",
      hour12: false,
      timeZone,
    })
  )
  const startMinute = parseInt(
    start.toLocaleTimeString("en-US", {
      minute: "numeric",
      hour12: false,
      timeZone,
    })
  )

  const endHour = parseInt(
    end.toLocaleTimeString("en-US", {
      hour: "numeric",
      hour12: false,
      timeZone,
    })
  )
  const endMinute = parseInt(
    end.toLocaleTimeString("en-US", {
      minute: "numeric",
      hour12: false,
      timeZone,
    })
  )

  let dateTimeString: string

  // Multiple days.
  if (
    start.toLocaleDateString("en-US", {timeZone: "America/Los_Angeles"}) !=
    end.toLocaleDateString("en-US", {timeZone: "America/Los_Angeles"})
  ) {
    dateTimeString =
      start.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
        timeZone,
      }) +
      " - " +
      end.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
        timeZone,
      })
    return dateTimeString
  }

  // All Day display.
  if ((startHour === 24 || startHour === 0) && startMinute === 0 && endHour === 23 && endMinute === 59) {
    return start.toLocaleDateString("en-us", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      timeZone,
    })
  }

  // Different start and end times.
  if (startHour !== endHour || startMinute !== endMinute) {
    dateTimeString = start.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      timeZone,
    })
    dateTimeString +=
      " | " +
      start.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        timeZone,
      })
    dateTimeString += " - "
    dateTimeString += end.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      timeZoneName: "short",
      timeZone,
    })
    return dateTimeString
  }

  // Start and end times are the same, just display the start time.
  return start.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    timeZoneName: "short",
    timeZone,
  })
}

export default StanfordEventCard
