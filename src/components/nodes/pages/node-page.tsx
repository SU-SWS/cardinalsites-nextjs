import StanfordPagePage from "@components/nodes/pages/stanford-page/stanford-page-page";
import StanfordPersonPage from "@components/nodes/pages/stanford-person/stanford-person-page";
import StanfordEventPage from "@components/nodes/pages/stanford-event/stanford-event-page";
import StanfordNewsPage from "@components/nodes/pages/stanford-news/stanford-news-page";
import StanfordPolicyPage from "@components/nodes/pages/stanford-policy/stanford-policy-page";
import StanfordPublicationPage from "@components/nodes/pages/stanford-publication/stanford-publication-page";
import StanfordCoursePage from "@components/nodes/pages/stanford-course/stanford-course-page";
import StanfordEventSeriesPage from "@components/nodes/pages/stanford-event-series/stanford-event-series-page";
import {isDraftMode} from "@lib/drupal/utils";
import {NodeUnion} from "@lib/gql/__generated__/drupal.d";

const NodePage = ({node}: { node: NodeUnion }) => {
  const draftMode = isDraftMode();
  const itemProps: { [key: string]: string } = {};

  if (draftMode) {
    itemProps['data-type'] = node.__typename || 'unknown';
    itemProps['data-id'] = node.id;
  }

  switch (node.__typename) {
    case 'NodeStanfordCourse':
      return <StanfordCoursePage node={node} {...itemProps}/>
    case 'NodeStanfordEvent':
      return <StanfordEventPage node={node} {...itemProps}/>
    case 'NodeStanfordEventSeries':
      return <StanfordEventSeriesPage node={node} {...itemProps}/>
    case 'NodeStanfordNews':
      return <StanfordNewsPage node={node} {...itemProps}/>
    case 'NodeStanfordPage':
      return <StanfordPagePage node={node} {...itemProps}/>
    case 'NodeStanfordPerson':
      return <StanfordPersonPage node={node} {...itemProps}/>
    case 'NodeStanfordPolicy':
      return <StanfordPolicyPage node={node} {...itemProps}/>
    case 'NodeStanfordPublication':
      return <StanfordPublicationPage node={node} {...itemProps}/>
  }
}
export default NodePage;