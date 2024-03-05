import SharedTagsCardView from "@components/views/shared-tags/shared-tags-card-view";
import PageListView from "@components/views/stanford-page/page-list-view";
import NewsCardView from "@components/views/stanford-news/news-card-view";
import NewsListView from "@components/views/stanford-news/news-list-view";
import PersonCardView from "@components/views/stanford-person/person-card-view";
import EventsCardView from "@components/views/stanford-events/events-card-view";
import EventsListView from "@components/views/stanford-events/events-list-view";
import PageCardView from "@components/views/stanford-page/page-card-view";
import CourseListView from "@components/views/stanford-courses/course-list-view";
import CourseCardView from "@components/views/stanford-courses/course-card-view";
import PublicationsApaView from "@components/views/stanford-publications/publications-apa-view";
import PublicationsChicagoView from "@components/views/stanford-publications/publications-chicago-view";
import {
  NodeStanfordCourse,
  NodeStanfordEvent,
  NodeStanfordNews,
  NodeStanfordPage,
  NodeStanfordPerson,
  NodeStanfordPublication,
  NodeUnion
} from "@lib/gql/__generated__/drupal.d";

interface Props {
  viewId: string;
  displayId: string;
  items: NodeUnion[]
  headingLevel?: "h2" | "h3"
}

const View = async ({viewId, displayId, items, headingLevel = "h3"}: Props) => {
  const component = `${viewId}--${displayId}`;

  switch (component) {
    case 'stanford_basic_pages--basic_page_type_list':
      return <PageListView
        items={items as NodeStanfordPage[]}
        headingLevel={headingLevel}
      />

    case 'stanford_news--vertical_cards':
      return <NewsCardView
        items={items as NodeStanfordNews[]}
        headingLevel={headingLevel}
      />

    case 'stanford_news--block_1':
      return <NewsListView
        items={items as NodeStanfordNews[]}
        headingLevel={headingLevel}
      />

    case 'stanford_person--grid_list_all':
      return <PersonCardView
        items={items as NodeStanfordPerson[]}
        headingLevel={headingLevel}
      />

    case 'stanford_events--cards':
      return <EventsCardView
        items={items as NodeStanfordEvent[]}
        headingLevel={headingLevel}
      />

    case 'stanford_events--past_events_list_block':
    case 'stanford_events--list_page':
      return <EventsListView
        items={items as NodeStanfordEvent[]}
        headingLevel={headingLevel}
      />

    case 'stanford_basic_pages--viewfield_block_1':
      return <PageCardView
        items={items as NodeStanfordPage[]}
        headingLevel={headingLevel}
      />

    case 'stanford_shared_tags--card_grid':
      return <SharedTagsCardView
        items={items}
        headingLevel={headingLevel}
      />

    case 'stanford_courses--default_list_viewfield_block':
      return <CourseListView
        items={items as NodeStanfordCourse[]}
        headingLevel={headingLevel}
      />

    case 'stanford_courses--vertical_teaser_viewfield_block':
      return <CourseCardView
        items={items as NodeStanfordCourse[]}
        headingLevel={headingLevel}
      />

    case 'stanford_publications--apa_list':
      return <PublicationsApaView
        items={items as NodeStanfordPublication[]}
        headingLevel={headingLevel}
      />

    case 'stanford_publications--chicago_list':
      return <PublicationsChicagoView
        items={items as NodeStanfordPublication[]}
        headingLevel={headingLevel}
      />
  }
}
export default View;