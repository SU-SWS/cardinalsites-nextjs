import {redirect} from "next/navigation";
import {getEventTimeString} from "@components/nodes/cards/stanford-event/stanford-event-card";
import {CalendarDaysIcon, MapPinIcon, PhoneIcon, UserGroupIcon} from "@heroicons/react/20/solid";
import Address from "@components/elements/address";
import Button from "@components/elements/button";
import Wysiwyg from "@components/elements/wysiwyg";
import Rows from "@components/paragraphs/rows/rows";
import {H1, H2, H3} from "@components/elements/headers";
import ScheduleParagraph from "@components/paragraphs/stanford-schedule/schedule-paragraph";
import {HtmlHTMLAttributes} from "react";
import {NodeStanfordEvent, ParagraphStanfordSchedule} from "@lib/gql/__generated__/drupal.d";
import Email from "@components/elements/email";
import Telephone from "@components/elements/telephone";
import Link from "@components/elements/link";
import {isDraftMode} from "@lib/drupal/utils";

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  node: NodeStanfordEvent
  headingLevel?: "h2" | "h3"
}

const StanfordEventPage = ({node, ...props}: Props) => {
  if (node.suEventSource?.url && !isDraftMode()) redirect(node.suEventSource.url)

  const startTime = new Date(node.suEventDateTime.value * 1000);
  const endTime = new Date(node.suEventDateTime.end_value * 1000);
  const timeZone = node.suEventDateTime.timezone || 'America/Los_Angeles';

  return (
    <article className="centered mt-32 flex flex-col gap-20" {...props}>
      <div className="flex flex-col">
        <H1 className="order-2">
          {node.title}
        </H1>

        {node.suEventType &&
          <div className="order-1">
            {node.suEventType[0].name}
          </div>
        }

      </div>
      {node.suEventSubheadline &&
        <div className="text-m2 font-bold">{node.suEventSubheadline}</div>
      }
      {node.suEventDek &&
        <div>{node.suEventDek}</div>
      }

      {node.suEventSponsor &&
        <div>
          {node.suEventSponsor.map((sponsor, i) =>
            <div key={`${node.id}-sponsor-${i}`}>
              {sponsor}
            </div>
          )}
        </div>
      }


      <div className="border border-black-40 py-20 px-10 lg:px-48 lg:w-3/4 mx-auto">
        <H2 className="text-m2">Event Details:</H2>
        <div className="grid items-start lg:grid-cols-2 gap-20">
          <time className="flex items-center gap-5" dateTime={startTime.toISOString()}>
            <CalendarDaysIcon width={30} className="shrink-0"/>
            {getEventTimeString(startTime, endTime, timeZone)}
          </time>


          {(node.suEventEmail || node.suEventTelephone) &&
            <div className="flex flex-col-2 gap-lg items-start">
              <PhoneIcon width={30} className="shrink-0"/>
              <div>
                <H3 className="text-m1">Contact</H3>

                {node.suEventEmail &&
                  <Email email={node.suEventEmail} className="block">
                    {node.suEventEmail}
                  </Email>
                }
                {node.suEventTelephone &&
                  <Telephone tel={node.suEventTelephone} className="block">
                    {node.suEventTelephone}
                  </Telephone>
                }
              </div>
            </div>
          }

          {(node.suEventLocation || node.suEventMapLink) &&
            <div className="flex flex-col-2 items-start gap-5">
              <MapPinIcon width={30} className="shrink-0"/>
              <div>
                <H3 className="text-m1">Location</H3>

                <div>
                  {node.suEventLocation &&
                    <Address {...node.suEventLocation}/>
                  }

                  {node.suEventMapLink?.url &&
                    <Link href={node.suEventMapLink.url}>
                      {node.suEventMapLink.title}
                    </Link>
                  }
                </div>
              </div>
            </div>
          }


          {node.suEventAudience &&
            <div className="flex flex-col-2 items-start gap-5">
              <UserGroupIcon width={30} className="shrink-0"/>
              <div>
                <H3 className="text-m1">This event is open to:</H3>
                {node.suEventAudience.map(audience =>
                  <div key={audience.id}>
                    {audience.name}
                  </div>
                )}
              </div>
            </div>
          }
        </div>

        {node.suEventCta &&
          <div className="mt-20">
            <Button href={node.suEventCta.url} centered>
              {node.suEventCta.title}
            </Button>
          </div>
        }
      </div>

      <Wysiwyg html={node.body?.processed} className="lg:w-3/4 mx-auto"/>

      <Rows components={node.suEventComponents}/>

      {node.suEventSchedule &&
        <div>
          {node.suEventSchedule.map(scheduleInstance =>
            <ScheduleParagraph paragraph={scheduleInstance as ParagraphStanfordSchedule} key={scheduleInstance.id}/>
          )}
        </div>
      }
    </article>
  )
}
export default StanfordEventPage;