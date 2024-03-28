import {HtmlHTMLAttributes} from "react";
import {NodeStanfordEvent} from "@lib/gql/__generated__/drupal.d";


type Props = HtmlHTMLAttributes<HTMLAnchorElement> & {
  node: NodeStanfordEvent
}

const EventDateHoriz = ({node, ...props}: Props) => {
  const timeZone = node.suEventDateTime.timezone || 'America/Los_Angeles';

  const start = new Date(node.suEventDateTime.value * 1000);
  const end = new Date(node.suEventDateTime.end_value * 1000);

  const startMonth = start.toLocaleDateString("en-US", {month: "short", timeZone})
  const startDay = parseInt(start.toLocaleDateString("en-US", {day: "numeric", timeZone}))

  const endMonth = end.toLocaleDateString("en-US", {month: "short", timeZone})
  const endDay = parseInt(end.toLocaleDateString("en-US", {day: "numeric", timeZone}))

  // Fix difference between server side render and client side render. Replace any strange characters.
  const dateTimeString = getEventTimeString(start, end, timeZone).replace(/[^a-zA-Z0-9 ,:\-|]/, ' ');
  const Heading = headingLevel === 'h3' ? H3 : H2;

  const endDate = ""
  endDate ? (startDay != endDay)|| (startMonth != endMonth) : null;

  return (
    <div aria-hidden className="flex w-fit justify-start  flex-row items-center min-w-[9rem] h-90">
    <time dateTime="2023-06-24 00:00Z" className="flex flex-col">
      <span className="text-m0 font-semibold w-full text-center"> {startMonth.toUpperCase()}</span>
      <span className="text-m4 font-bold w-full text-center">{startDay}</span>
    </time>
    
    <span className='relative font-normal leading-trim top-7 text-m0 px-03em' aria-hidden='true'>– to –</span>
    <span className='sr-only'>to</span>
    <time dateTime='2023-07-03 00:00Z' className='flex flex-col'>
      <span className='text-m0 font-semibold w-full text-center'>{endMonth.toUpperCase()}</span>
      <span className='text-m4 font-bold w-full text-center'>{endDay}</span>
    </time>
  </div>
  )
}
export default EventDateHoriz;