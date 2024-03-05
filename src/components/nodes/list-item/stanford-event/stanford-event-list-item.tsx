import Link from "@components/elements/link";
import {CalendarDaysIcon, MapPinIcon} from "@heroicons/react/20/solid";
import Address from "@components/elements/address";
import {H2, H3} from "@components/elements/headers";
import {HtmlHTMLAttributes} from "react";
import {NodeStanfordEvent} from "@lib/gql/__generated__/drupal.d";
import {getEventTimeString} from "@components/nodes/cards/stanford-event/stanford-event-card";

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  node: NodeStanfordEvent
  headingLevel?: "h2" | "h3"
}

const StanfordEventListItem = ({node, headingLevel, ...props}: Props) => {

  const timeZone = node.suEventDateTime.timezone || 'America/Los_Angeles';
  const start = new Date(node.suEventDateTime.value * 1000);
  const end = new Date(node.suEventDateTime.end_value * 1000);

  const startMonth = start.toLocaleDateString("en-US", {month: "short", timeZone})
  const startDay = parseInt(start.toLocaleDateString("en-US", {day: "numeric", timeZone}))

  // Fix difference between server side render and client side render. Replace any strange characters.
  const dateTimeString = getEventTimeString(start, end, timeZone).replace(/[^a-zA-Z0-9 ,:\-|]/, ' ');
  const Heading = headingLevel === 'h3' ? H3 : H2;

  return (
    <article aria-labelledby={node.id} className="w-full mx-auto py-10 flex gap-10" {...props}>
      <div aria-hidden className="flex flex-col items-start w-fit">
        <div className="text-m0 font-semibold mb-4 w-full text-center">
          {startMonth.toUpperCase()}
        </div>
        <div className="text-m4 font-bold w-full text-center">
          {startDay}
        </div>
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
        {node.suEventDek &&
          <p>{node.suEventDek}</p>
        }

        <time className="flex items-center gap-5 mb-5" dateTime={start.toISOString()}>
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
      </div>
    </article>
  )
}

export default StanfordEventListItem;