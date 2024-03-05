import StanfordCourseCard from "@components/nodes/cards/stanford-course/stanford-course-card";
import StanfordEventCard from "@components/nodes/cards/stanford-event/stanford-event-card";
import StanfordEventSeriesCard from "@components/nodes/cards/stanford-event-series/stanford-event-series-card";
import StanfordNewsCard from "@components/nodes/cards/stanford-news/stanford-news-card";
import StanfordPageCard from "@components/nodes/cards/stanford-page/stanford-page-card";
import StanfordPersonCard from "@components/nodes/cards/stanford-person/stanford-person-card";
import StanfordPolicyCard from "@components/nodes/cards/stanford-policy/stanford-policy-card";
import StanfordPublicationCard from "@components/nodes/cards/stanford-publication/stanford-publication-card";
import {isDraftMode} from "@lib/drupal/utils";
import {NodeUnion} from "@lib/gql/__generated__/drupal.d";

const NodeCard = ({node, headingLevel}: { node: NodeUnion, headingLevel?: "h2" | "h3" }) => {
  const draftMode = isDraftMode();
  const itemProps: { [key: string]: string } = {};
  if (draftMode) {
    itemProps['data-type'] = node.__typename || 'unknown';
    itemProps['data-id'] = node.id;
  }
  switch (node.__typename) {
    case 'NodeStanfordCourse':
      return <StanfordCourseCard node={node} headingLevel={headingLevel} {...itemProps}/>
    case 'NodeStanfordEvent':
      return <StanfordEventCard node={node} headingLevel={headingLevel} {...itemProps}/>
    case 'NodeStanfordEventSeries':
      return <StanfordEventSeriesCard node={node} headingLevel={headingLevel} {...itemProps}/>
    case 'NodeStanfordNews':
      return <StanfordNewsCard node={node} headingLevel={headingLevel} {...itemProps}/>
    case 'NodeStanfordPage':
      return <StanfordPageCard node={node} headingLevel={headingLevel} {...itemProps}/>
    case 'NodeStanfordPerson':
      return <StanfordPersonCard node={node} headingLevel={headingLevel} {...itemProps}/>
    case 'NodeStanfordPolicy':
      return <StanfordPolicyCard node={node} headingLevel={headingLevel} {...itemProps}/>
    case 'NodeStanfordPublication':
      return <StanfordPublicationCard node={node} headingLevel={headingLevel} {...itemProps}/>
  }
}
export default NodeCard;