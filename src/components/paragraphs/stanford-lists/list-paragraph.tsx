import Wysiwyg from "@components/elements/wysiwyg";
import Button from "@components/elements/button";
import View from "@components/views/view";
import {H2} from "@components/elements/headers";
import {cache, HtmlHTMLAttributes} from "react";
import {
  Maybe,
  NodeStanfordCourse, NodeStanfordEvent, NodeStanfordNews,
  NodeStanfordPage, NodeStanfordPerson, NodeStanfordPublication,
  NodeUnion,
  ParagraphStanfordList
} from "@lib/gql/__generated__/drupal.d";
import {getParagraphBehaviors} from "@components/paragraphs/get-paragraph-behaviors";
import {graphqlClient} from "@lib/gql/gql-client";
import {buildHeaders} from "@lib/drupal/utils";
import {twMerge} from "tailwind-merge";

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  paragraph: ParagraphStanfordList
}

const ListParagraph = async ({paragraph, ...props}: Props) => {
  const behaviors = getParagraphBehaviors(paragraph);
  const viewId = paragraph.suListView?.view || '';
  const displayId = paragraph.suListView?.display || '';
  const viewItems = await getViewItems(viewId, displayId, paragraph.suListView?.contextualFilter, paragraph.suListView?.pageSize);

  if (behaviors.list_paragraph?.hide_empty && viewItems.length === 0) return null;

  return (
    <div className="centered lg:max-w-[980px] flex flex-col gap-10 mb-20" {...props}>
      {paragraph.suListHeadline &&
        <H2 className={twMerge("text-center", behaviors.list_paragraph?.hide_heading && "sr-only")}>
          {paragraph.suListHeadline}
        </H2>
      }

      <Wysiwyg html={paragraph.suListDescription?.processed}/>

      {viewItems &&
        <View
          viewId={viewId}
          displayId={displayId}
          items={viewItems}
          headingLevel={paragraph.suListHeadline ? 'h3' : 'h2'}
        />
      }

      {(viewItems.length === 0 && behaviors.list_paragraph?.empty_message) &&
        <p>{behaviors.list_paragraph.empty_message}</p>
      }

      {paragraph.suListButton?.url &&
        <div>
          <Button centered href={paragraph.suListButton.url}>
            {paragraph.suListButton.title}
          </Button>
        </div>
      }
    </div>
  )
}

const getViewItems = cache(async (viewId: string, displayId: string, contextualFilter?: Maybe<string[]>, pageSize?: Maybe<number>, page?: Maybe<number>, offset?: Maybe<number>): Promise<NodeUnion[]> => {
  let items: NodeUnion[] = []
  // View filters allow multiples of 3 for page sizes. If the user wants 4, we'll fetch 6 and then slice it at the end.
  const itemsPerPage = pageSize ? Math.ceil(pageSize / 3) * 3 : undefined;
  const queryVariables = {pageSize: itemsPerPage, page, offset};
  
  const tags = ['views'];
  switch (`${viewId}--${displayId}`) {
    case 'stanford_shared_tags--card_grid':
      tags.push('views:all');
      break;

    case 'stanford_basic_pages--basic_page_type_list':
    case 'stanford_basic_pages--viewfield_block_1':
      tags.push('views:stanford_page');
      break

    case 'stanford_courses--default_list_viewfield_block':
    case 'stanford_courses--vertical_teaser_viewfield_block':
      tags.push('views:stanford_course');
      break

    case 'stanford_events--cards':
    case 'stanford_events--list_page':
    case 'stanford_events--past_events_list_block':
      tags.push('views:stanford_event');
      break

    case 'stanford_news--block_1':
    case 'stanford_news--vertical_cards':
      tags.push('views:stanford_news');
      break

    case 'stanford_person--grid_list_all':
      tags.push('views:stanford_person');
      break

    case 'stanford_publications--apa_list':
    case 'stanford_publications--chicago_list':
      tags.push('views:stanford_publication');
      break
  }

  const headers = await buildHeaders();
  const client = graphqlClient({headers, next: {tags}});
  let filters = getViewFilters(['term_node_taxonomy_name_depth'], contextualFilter)
  let graphqlResponse;

  switch (`${viewId}--${displayId}`) {
    case 'stanford_basic_pages--basic_page_type_list':
    case 'stanford_basic_pages--viewfield_block_1':
      filters = getViewFilters(['term_node_taxonomy_name_depth', 'nid'], contextualFilter)
      graphqlResponse = await client.stanfordBasicPages({filters, ...queryVariables});
      items = graphqlResponse.stanfordBasicPages?.results as unknown as NodeStanfordPage[]
      break

    case 'stanford_courses--default_list_viewfield_block':
    case 'stanford_courses--vertical_teaser_viewfield_block':
      graphqlResponse = await client.stanfordCourses({filters, ...queryVariables});
      items = graphqlResponse.stanfordCourses?.results as unknown as NodeStanfordCourse[]
      break

    case 'stanford_events--cards':
    case 'stanford_events--list_page':
      filters = getViewFilters(['term_node_taxonomy_name_depth', 'term_node_taxonomy_name_depth_1', 'term_node_taxonomy_name_depth_2', 'term_node_taxonomy_name_depth_3'], contextualFilter)
      graphqlResponse = await client.stanfordEventsCardGrid({filters, ...queryVariables});
      items = graphqlResponse.stanfordEventsCardGrid?.results as unknown as NodeStanfordEvent[]
      break

    case 'stanford_events--past_events_list_block':
      graphqlResponse = await client.stanfordEventsPastEvents({filters, ...queryVariables});
      items = graphqlResponse.stanfordEventsPastEvents?.results as unknown as NodeStanfordEvent[]
      break

    case 'stanford_news--block_1':
    case 'stanford_news--vertical_cards':
      graphqlResponse = await client.stanfordNewsDefaultList({filters, ...queryVariables});
      items = graphqlResponse.stanfordNewsDefaultList?.results as unknown as NodeStanfordNews[]
      break

    case 'stanford_person--grid_list_all':
      graphqlResponse = await client.stanfordPerson({filters, ...queryVariables});
      items = graphqlResponse.stanfordPerson?.results as unknown as NodeStanfordPerson[]
      break

    case 'stanford_publications--apa_list':
    case 'stanford_publications--chicago_list':
      graphqlResponse = await client.stanfordPublicationsApa({filters, ...queryVariables});
      items = graphqlResponse.stanfordPublicationsApa?.results as unknown as NodeStanfordPublication[]
      break

    case 'stanford_shared_tags--card_grid':
      filters = getViewFilters(['term_node_taxonomy_name_depth', 'type'], contextualFilter)
      if (filters && Object.keys(filters).length === 2) filters.nid = '0'
      graphqlResponse = await client.stanfordSharedTags({filters, ...queryVariables});
      items = graphqlResponse.stanfordSharedTags?.results as unknown as NodeUnion[]
      break

    default:
      console.error(`Unable to find query for view: ${viewId} display: ${displayId}`)
      break;
  }

  return pageSize ? items.slice(0, pageSize) : items;
})

const getViewFilters = (keys: string[], values?: Maybe<string[]>) => {
  if (!keys || !values) return;
  const filters: Record<string, string | undefined> = keys.reduce((obj, key, index) => ({
    ...obj,
    [key]: values[index]
  }), {})
  Object.keys(filters).forEach(key => filters[key] === undefined && delete filters[key]);
  return filters;
}

export default ListParagraph;