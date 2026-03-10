import {JSX} from "react"
import SharedTagsCardView from "@components/views/shared-tags/shared-tags-card-view"
import PageListView from "@components/views/stanford-page/page-list-view"
import NewsCardView from "@components/views/stanford-news/news-card-view"
import NewsListView from "@components/views/stanford-news/news-list-view"
import PersonCardView from "@components/views/stanford-person/person-card-view"
import EventsCardView from "@components/views/stanford-events/events-card-view"
import EventsListView from "@components/views/stanford-events/events-list-view"
import PageCardView from "@components/views/stanford-page/page-card-view"
import CourseListView from "@components/views/stanford-courses/course-list-view"
import CourseCardView from "@components/views/stanford-courses/course-card-view"
import PublicationsApaView from "@components/views/stanford-publications/publications-apa-view"
import PublicationsChicagoView from "@components/views/stanford-publications/publications-chicago-view"
import {
  Maybe,
  NodeStanfordCourse,
  NodeStanfordEvent,
  NodeStanfordMedia,
  NodeStanfordNews,
  NodeStanfordOpportunity,
  NodeStanfordPage,
  NodeStanfordPerson,
  NodeStanfordPublication,
  NodeUnion,
} from "@lib/gql/__generated__/graphql"
import OpportunitiesCardView from "@components/views/stanford-opportunities/opportunities-card-view"
import OpportunitiesListView from "@components/views/stanford-opportunities/opportunities-list-view"
import {ViewFilter} from "@lib/gql/gql-views"
import MediaListView from "@components/views/stanford-media/media-list-view"
import MediaCardView from "@components/views/stanford-media/media-card-view"

export type ViewDisplayProps<T extends NodeUnion = NodeUnion> = {
  /**
   * List of node entities.
   */
  items: T[]
  /**
   * If those nodes titles should display as <h2> or <h3>
   */
  headingLevel?: "h2" | "h3"
  /**
   * Total number of items to build the pager.
   */
  totalItems: number
  /**
   * Server action callback to fetch the next "page" contents.
   */
  loadPage?: (_page?: Maybe<number>, _filter?: ViewFilter) => Promise<JSX.Element>
  /**
   * If the view is a filtering with input fields.
   */
  filtered?: boolean
}

type Props = {
  /**
   * View Machine Name.
   */
  viewId: string
  /**
   * Display machine name.
   */
  displayId: string
  /**
   * List of nodes to display.
   */
  items: NodeUnion[]
  /**
   * If those nodes titles should display as <h2> or <h3>
   */
  headingLevel?: "h2" | "h3"
  /**
   * Total number of items to build the pager.
   */
  totalItems: number
  /**
   * Server action to load a page.
   */
  loadPage?: ViewDisplayProps["loadPage"]
}

const View = async ({viewId, displayId, items, totalItems, loadPage, headingLevel = "h3"}: Props) => {
  const component = `${viewId}--${displayId}`

  const viewProps = {totalItems, headingLevel, loadPage, filtered: component.includes("filtered")}

  switch (component) {
    case "search--search":
    case "stanford_basic_pages--basic_page_type_list":
      return <PageListView items={items as NodeStanfordPage[]} {...viewProps} />

    case "stanford_news--vertical_cards":
    case "stanford_news_filtered--spotlight_cards":
    case "stanford_news--spotlight_card_grid":
    case "stanford_news--spotlight_card_grid_no_date":
      return <NewsCardView items={items as NodeStanfordNews[]} {...viewProps} />

    case "stanford_news--block_1":
      return <NewsListView items={items as NodeStanfordNews[]} {...viewProps} />

    case "stanford_person--grid_list_all":
    case "people_filtered--grid_list_all":
      return <PersonCardView items={items as NodeStanfordPerson[]} {...viewProps} />

    case "stanford_events--cards":
      return <EventsCardView items={items as NodeStanfordEvent[]} {...viewProps} />

    case "stanford_events--past_events_list_block":
    case "stanford_events--list_page":
      return <EventsListView items={items as NodeStanfordEvent[]} {...viewProps} />

    case "stanford_basic_pages--viewfield_block_1":
    case "stanford_basic_pages--card_grid_alpha":
      return <PageCardView items={items as NodeStanfordPage[]} {...viewProps} />

    case "stanford_shared_tags--card_grid":
      return <SharedTagsCardView items={items} {...viewProps} />

    case "stanford_courses--default_list_viewfield_block":
    case "courses_filtered--list":
      return <CourseListView items={items as NodeStanfordCourse[]} {...viewProps} />

    case "stanford_courses--vertical_teaser_viewfield_block":
    case "courses_filtered--card_grid":
      return <CourseCardView items={items as NodeStanfordCourse[]} {...viewProps} />

    case "stanford_publications--apa_list":
      return <PublicationsApaView items={items as NodeStanfordPublication[]} {...viewProps} />

    case "stanford_publications--chicago_list":
      return <PublicationsChicagoView items={items as NodeStanfordPublication[]} {...viewProps} />

    case "stanford_opportunities--cards":
    case "stanford_opportunities_filtered--cards":
      return <OpportunitiesCardView items={items as NodeStanfordOpportunity[]} {...viewProps} />

    case "stanford_opportunities--list":
    case "stanford_opportunities_filtered--list_page":
      return <OpportunitiesListView items={items as NodeStanfordOpportunity[]} {...viewProps} />

    case "media_content--list":
    case "media_filtered--default_list":
      return <MediaListView items={items as NodeStanfordMedia[]} {...viewProps} />

    case "media_content--card_grid":
    case "media_filtered--card_grid":
      return <MediaCardView items={items as NodeStanfordMedia[]} {...viewProps} />

    default:
      console.warn(`Unable to find component for view: ${viewId} display: ${displayId}`)
  }
}
export default View
