import StanfordPagePage from "@components/nodes/pages/stanford-page/stanford-page-page"
import StanfordPersonPage from "@components/nodes/pages/stanford-person/stanford-person-page"
import StanfordEventPage from "@components/nodes/pages/stanford-event/stanford-event-page"
import StanfordNewsPage from "@components/nodes/pages/stanford-news/stanford-news-page"
import StanfordPolicyPage from "@components/nodes/pages/stanford-policy/stanford-policy-page"
import StanfordPublicationPage from "@components/nodes/pages/stanford-publication/stanford-publication-page"
import StanfordCoursePage from "@components/nodes/pages/stanford-course/stanford-course-page"
import StanfordEventSeriesPage from "@components/nodes/pages/stanford-event-series/stanford-event-series-page"
import StanfordOpportunityPage from "@components/nodes/pages/stanford-opportunity/stanford-opportunity-page"
import {NodeUnion} from "@lib/gql/__generated__/graphql"
import StanfordMediaPage from "@components/nodes/pages/stanford-media/stanford-media-page"

const NodePage = ({node, isHome}: {node: NodeUnion; isHome?: boolean}) => {
  const itemProps: {[key: string]: string} = {}

  if (process.env.NODE_ENV === "development") {
    itemProps["data-type"] = node.__typename || "unknown"
    itemProps["data-id"] = node.uuid
  }

  switch (node.__typename) {
    case "NodeStanfordCourse":
      return <StanfordCoursePage node={node} {...itemProps} />
    case "NodeStanfordEvent":
      return <StanfordEventPage node={node} {...itemProps} />
    case "NodeStanfordEventSeries":
      return <StanfordEventSeriesPage node={node} {...itemProps} />
    case "NodeStanfordMedia":
      return <StanfordMediaPage node={node} {...itemProps} />
    case "NodeStanfordNews":
      return <StanfordNewsPage node={node} {...itemProps} />
    case "NodeStanfordPage":
      return <StanfordPagePage node={node} isHome={isHome} {...itemProps} />
    case "NodeStanfordPerson":
      return <StanfordPersonPage node={node} {...itemProps} />
    case "NodeStanfordPolicy":
      return <StanfordPolicyPage node={node} {...itemProps} />
    case "NodeStanfordPublication":
      return <StanfordPublicationPage node={node} {...itemProps} />
    case "NodeStanfordOpportunity":
      return <StanfordOpportunityPage node={node} {...itemProps} />
  }
}

export const NodePageSkeleton = () => {
  return (
    <div className="centered my-32">
      <div className="mb-20 h-16 w-1/2 bg-black-10" />
      <div className="mb-5 h-7 w-full bg-black-10" />
      <div className="mb-5 h-7 w-full bg-black-10" />
      <div className="h-7 w-1/3 bg-black-10" />
    </div>
  )
}

export default NodePage
