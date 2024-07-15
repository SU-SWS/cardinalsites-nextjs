import {redirect} from "next/navigation"
import {getEventTimeString} from "@components/nodes/cards/stanford-event/stanford-event-card"
import {CalendarDaysIcon, MapPinIcon, PhoneIcon, UserGroupIcon} from "@heroicons/react/20/solid"
import Address from "@components/elements/address"
import Button from "@components/elements/button"
import Wysiwyg from "@components/elements/wysiwyg"
import Rows from "@components/paragraphs/rows/rows"
import {H1, H2, H3} from "@components/elements/headers"
import ScheduleParagraph from "@components/paragraphs/stanford-schedule/schedule-paragraph"
import {HtmlHTMLAttributes} from "react"
import {NodeStanfordEvent, ParagraphStanfordSchedule} from "@lib/gql/__generated__/drupal.d"
import Email from "@components/elements/email"
import Telephone from "@components/elements/telephone"
import Link from "@components/elements/link"
import {isPreviewMode} from "@lib/drupal/is-preview-mode"

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  node: NodeStanfordEvent
  headingLevel?: "h2" | "h3"
}

const StanfordEventPage = ({node, ...props}: Props) => {
  if (node.suEventSource?.url && !isPreviewMode()) redirect(node.suEventSource.url)

  const startTime = new Date(node.suEventDateTime.value * 1000)
  const endTime = new Date(node.suEventDateTime.end_value * 1000)
  const timeZone = node.suEventDateTime.timezone || "America/Los_Angeles"

  return (
    <article className="centered mt-32 flex flex-col gap-20" {...props}>
      <div className="flex flex-col">
        <H1 className="order-2">{node.title}</H1>

        {node.suEventType && <div className="order-1">{node.suEventType[0].name}</div>}
      </div>
      {node.suEventSubheadline && <div className="type-3 font-bold">{node.suEventSubheadline}</div>}
      {node.suEventDek && <div>{node.suEventDek}</div>}

      {node.suEventSponsor && (
        <div>
          {node.suEventSponsor.map((sponsor, i) => (
            <div key={`${node.id}-sponsor-${i}`}>{sponsor}</div>
          ))}
        </div>
      )}

      <div className="mx-auto border border-black-40 px-10 py-20 lg:w-3/4 lg:px-48">
        <H2 className="type-3">Event Details:</H2>
        <div className="grid items-start gap-20 lg:grid-cols-2">
          <time className="flex items-center gap-5" dateTime={startTime.toISOString()}>
            <CalendarDaysIcon width={30} className="shrink-0" />
            {getEventTimeString(startTime, endTime, timeZone)}
          </time>

          {(node.suEventEmail || node.suEventTelephone) && (
            <div className="flex-col-2 flex items-start gap-lg">
              <PhoneIcon width={30} className="shrink-0" />
              <div>
                <H3 className="type-2">Contact</H3>

                {node.suEventEmail && (
                  <Email email={node.suEventEmail} className="block">
                    {node.suEventEmail}
                  </Email>
                )}
                {node.suEventTelephone && (
                  <Telephone tel={node.suEventTelephone} className="block">
                    {node.suEventTelephone}
                  </Telephone>
                )}
              </div>
            </div>
          )}

          {(node.suEventLocation || node.suEventMapLink) && (
            <div className="flex-col-2 flex items-start gap-5">
              <MapPinIcon width={30} className="shrink-0" />
              <div>
                <H3 className="type-2">Location</H3>

                <div>
                  {node.suEventLocation && <Address {...node.suEventLocation} />}

                  {node.suEventMapLink?.url && <Link href={node.suEventMapLink.url}>{node.suEventMapLink.title}</Link>}
                </div>
              </div>
            </div>
          )}

          {node.suEventAudience && (
            <div className="flex-col-2 flex items-start gap-5">
              <UserGroupIcon width={30} className="shrink-0" />
              <div>
                <H3 className="type-2">This event is open to:</H3>
                {node.suEventAudience.map(audience => (
                  <div key={audience.id}>{audience.name}</div>
                ))}
              </div>
            </div>
          )}
        </div>

        {node.suEventCta && (
          <div className="mt-20">
            <Button href={node.suEventCta.url} centered>
              {node.suEventCta.title}
            </Button>
          </div>
        )}
      </div>

      <Wysiwyg html={node.body?.processed} className="mx-auto lg:w-3/4" />

      <Rows components={node.suEventComponents} />

      {node.suEventSchedule && (
        <div>
          {node.suEventSchedule.map(scheduleInstance => (
            <ScheduleParagraph paragraph={scheduleInstance as ParagraphStanfordSchedule} key={scheduleInstance.id} />
          ))}
        </div>
      )}
    </article>
  )
}
export default StanfordEventPage
