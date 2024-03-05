import Wysiwyg from "@components/elements/wysiwyg";
import Address from "@components/elements/address";
import {H3} from "@components/elements/headers";
import PersonCtaParagraph from "@components/paragraphs/stanford-person-cta/person-cta-paragraph";
import {HtmlHTMLAttributes} from "react";
import {ParagraphStanfordPersonCtum, ParagraphStanfordSchedule} from "@lib/gql/__generated__/drupal.d";

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  paragraph: ParagraphStanfordSchedule
}

const ScheduleParagraph = ({paragraph, ...props}: Props) => {
  let start
  if (paragraph.suScheduleDateTime?.value) {
    start = new Date(paragraph.suScheduleDateTime.value * 1000).toLocaleDateString('en-us', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      timeZone: paragraph.suScheduleDateTime.timezone || 'America/Los_Angeles',
    })
  }

  return (
    <div className="centered" {...props}>
      {start &&
        <H3>{start}</H3>
      }
      {paragraph.suScheduleHeadline &&
        <div>
          {paragraph.suScheduleHeadline}
        </div>
      }

      <Wysiwyg html={paragraph.suScheduleDescription?.processed}/>

      {paragraph.suScheduleLocation &&
        <Address {...paragraph.suScheduleLocation}/>
      }
      {paragraph.suScheduleSpeaker &&
        <div>
          {paragraph.suScheduleSpeaker.map(speaker =>
            <PersonCtaParagraph paragraph={speaker as ParagraphStanfordPersonCtum} key={speaker.id}/>
          )}
        </div>
      }

    </div>
  )
}
export default ScheduleParagraph