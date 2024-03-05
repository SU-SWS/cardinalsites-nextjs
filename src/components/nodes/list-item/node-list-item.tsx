import StanfordCourseListItem from "@components/nodes/list-item/stanford-course/stanford-course-list-item";
import StanfordEventListItem from "@components/nodes/list-item/stanford-event/stanford-event-list-item";
import StanfordEventSeriesListItem
  from "@components/nodes/list-item/stanford-event-series/stanford-event-series-list-item";
import StanfordNewsListItem from "@components/nodes/list-item/stanford-news/stanford-news-list-item";
import StanfordPageListItem from "@components/nodes/list-item/stanford-page/stanford-page-list-item";
import StanfordPersonListItem from "@components/nodes/list-item/stanford-person/stanford-person-list-item";
import StanfordPolicyListItem from "@components/nodes/list-item/stanford-policy/stanford-policy-list-item";
import StanfordPublicationListItem
  from "@components/nodes/list-item/stanford-publication/stanford-publication-list-item";
import {isDraftMode} from "@lib/drupal/utils";
import {NodeUnion} from "@lib/gql/__generated__/drupal.d";

const NodeListItem = ({node, headingLevel}: { node: NodeUnion, headingLevel?: "h2" | "h3" }) => {
  const draftMode = isDraftMode();
  const itemProps: { [key: string]: string } = {};
  if (draftMode) {
    itemProps['data-type'] = node.__typename || 'unknown';
    itemProps['data-id'] = node.id;
  }

  switch (node.__typename) {
    case 'NodeStanfordCourse':
      return <StanfordCourseListItem node={node} headingLevel={headingLevel} {...itemProps}/>
    case 'NodeStanfordEvent':
      return <StanfordEventListItem node={node} headingLevel={headingLevel} {...itemProps}/>
    case 'NodeStanfordEventSeries':
      return <StanfordEventSeriesListItem node={node} headingLevel={headingLevel} {...itemProps}/>
    case 'NodeStanfordNews':
      return <StanfordNewsListItem node={node} headingLevel={headingLevel} {...itemProps}/>
    case 'NodeStanfordPage':
      return <StanfordPageListItem node={node} headingLevel={headingLevel} {...itemProps}/>
    case 'NodeStanfordPerson':
      return <StanfordPersonListItem node={node} headingLevel={headingLevel} {...itemProps}/>
    case 'NodeStanfordPolicy':
      return <StanfordPolicyListItem node={node} headingLevel={headingLevel} {...itemProps}/>
    case 'NodeStanfordPublication':
      return <StanfordPublicationListItem node={node} headingLevel={headingLevel} {...itemProps}/>
  }
}
export default NodeListItem;