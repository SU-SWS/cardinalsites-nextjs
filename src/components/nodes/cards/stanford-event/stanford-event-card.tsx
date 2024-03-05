import Link from "@components/elements/link";
import {CalendarDaysIcon, MapPinIcon} from "@heroicons/react/20/solid";
import {H2, H3} from "@components/elements/headers";
import {HtmlHTMLAttributes} from "react";
import {NodeStanfordEvent} from "@lib/gql/__generated__/drupal.d";
import Address from "@components/elements/address";

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  node: NodeStanfordEvent
  headingLevel?: "h2" | "h3"
}

const StanfordEventCard = ({node, headingLevel, ...props}: Props) => {

  const timeZone = node.suEventDateTime.timezone || 'America/Los_Angeles';

  const start = new Date(node.suEventDateTime.value * 1000);
  const end = new Date(node.suEventDateTime.end_value * 1000);

  const startMonth = start.toLocaleDateString("en-US", {month: "short", timeZone})
  const startDay = parseInt(start.toLocaleDateString("en-US", {day: "numeric", timeZone}))

  // Fix difference between server side render and client side render. Replace any strange characters.
  const dateTimeString = getEventTimeString(start, end, timeZone).replace(/[^a-zA-Z0-9 ,:\-|]/, ' ');
  const Heading = headingLevel === 'h3' ? H3 : H2;
  return (
    <article aria-labelledby={node.id}
             className="mx-auto shadow-lg border border-black-20 p-10 flex flex-col gap-5 overflow-hidden" {...props}>
      <div aria-hidden className="flex flex-col items-start w-fit">
        <div className="text-m0 font-semibold mb-4 w-full text-center">
          {startMonth.toUpperCase()}
        </div>
        <div className="text-m4 font-bold w-full text-center">
          {startDay}
        </div>
      </div>

      <div className="flex flex-col">
        <Heading className="text-m2 [&_a]:text-black [&_a]:hocus:text-digital-red" id={node.id}>
          <Link href={node.suEventSource?.url || node.path}>
            {node.title}
          </Link>
        </Heading>

        {node.suEventType &&
          <div className="su-digital-red order-first">
            {node.suEventType[0].name}
          </div>
        }
      </div>

      {node.suEventSubheadline &&
        <div className="text-m1 font-bold mb-5">
          {node.suEventSubheadline}
        </div>
      }

      <time className="flex items-center gap-5" dateTime={start.toISOString()}>
        <CalendarDaysIcon width={30} className="shrink-0"/>
        {dateTimeString}
      </time>

      {node.suEventLocation &&
        <div>
          <div className="flex items-center gap-5">
            <MapPinIcon width={30} className="shrink-0"/>
            <Address {...node.suEventLocation}/>
          </div>
        </div>
      }

      {node.suEventAltLoc &&
        <div className="flex items-center gap-5">
          <MapPinIcon width={30} className="shrink-0"/>
          {node.suEventAltLoc}
        </div>
      }
    </article>
  )
}


export const getEventTimeString = (start: Date, end: Date, timeZone: string): string => {
  const startHour = parseInt(start.toLocaleTimeString("en-US", {
    hour: "numeric",
    hour12: false,
    timeZone
  }))
  const startMinute = parseInt(start.toLocaleTimeString("en-US", {
    minute: "numeric",
    hour12: false,
    timeZone
  }))

  const endHour = parseInt(end.toLocaleTimeString("en-US", {
    hour: "numeric",
    hour12: false,
    timeZone
  }))
  const endMinute = parseInt(end.toLocaleTimeString("en-US", {
    minute: "numeric",
    hour12: false,
    timeZone
  }))

  let dateTimeString: string;

  // Multiple days.
  if (start.toLocaleDateString("en-US", {timeZone: 'America/Los_Angeles'}) != end.toLocaleDateString("en-US", {timeZone: 'America/Los_Angeles'})) {
    dateTimeString = start.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      timeZone
    }) + ' - ' + end.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      timeZone
    })
    return dateTimeString;
  }

  // All Day display.
  if (
    (startHour === 24 || startHour === 0) &&
    startMinute === 0 &&
    endHour === 23 &&
    endMinute === 59
  ) {
    return start.toLocaleDateString('en-us', {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      timeZone
    });
  }


  // Different start and end times.
  if (startHour !== endHour || startMinute !== endMinute) {
    dateTimeString = start.toLocaleDateString('en-US', {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      timeZone
    });
    dateTimeString += " | " + start.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      timeZone
    });
    dateTimeString += ' - ';
    dateTimeString += end.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      timeZoneName: "short",
      timeZone
    })
    return dateTimeString;
  }

  // Start and end times are the same, just display the start time.
  return start.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    timeZoneName: "short",
    timeZone
  })
}

export default StanfordEventCard;