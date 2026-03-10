import {JSX} from "react"
import View from "@components/views/view"
import {
  Maybe,
  NodeUnion,
  SearchDocument,
  SearchFilterInput,
  SearchQuery,
  StanfordBasicPagesSortKeys,
  StanfordBasicPagesDocument,
  StanfordBasicPagesQuery,
  StanfordCoursesDocument,
  StanfordCoursesQuery,
  StanfordEventsDocument,
  StanfordEventsQuery,
  StanfordEventsPastEventsDocument,
  StanfordEventsPastEventsQuery,
  StanfordMediaDocument,
  StanfordMediaQuery,
  StanfordNewsDocument,
  StanfordNewsQuery,
  StanfordOpportunitiesDocument,
  StanfordOpportunitiesQuery,
  StanfordPersonDocument,
  StanfordPersonQuery,
  StanfordPublicationsDocument,
  StanfordPublicationsQuery,
  StanfordSharedTagsDocument,
  StanfordSharedTagsQuery,
  ViewPageInfo,
} from "@lib/gql/__generated__/graphql"
import {graphqlClient} from "@lib/gql/gql-client"
import {cacheTag} from "next/dist/server/use-cache/cache-tag"

/** Default number of items per page requested from Drupal views. */
export const VIEW_PAGE_SIZE = 21

/**
 * Filter input for view queries — a map of exposed field keys to scalar or array values.
 * Distinct from the GraphQL schema's `ViewFilter` type, which describes filter configuration.
 */
export type ViewFilter = Maybe<Record<string, string | number | Array<string | number>>>

/**
 * Server action that fetches one page of view items and returns a rendered `<View>` element.
 *
 * Designed to be bound as a Next.js server action so client components (e.g. a
 * filtered-list paragraph) can trigger server-side page transitions:
 * `loadViewPage.bind(null, viewId, displayId, hasHeadline, pageSize)`.
 */
export const loadViewPage = async (
  viewId: string,
  displayId: string,
  hasHeadline: boolean,
  pageSize: number = VIEW_PAGE_SIZE,
  contextualFilter?: Maybe<string[]>,
  page?: Maybe<number>,
  filter?: ViewFilter
): Promise<JSX.Element> => {
  "use server"

  const {items, totalItems} = await getViewPagedItems(viewId, displayId, pageSize, contextualFilter, page, filter)
  return (
    <View
      viewId={viewId}
      displayId={displayId}
      items={items}
      headingLevel={hasHeadline ? "h3" : "h2"}
      totalItems={totalItems}
    />
  )
}

/**
 * Fetches one page of items from a Drupal Views endpoint.
 *
 * Dispatches to the correct GraphQL query based on `viewId` and `displayId`, rounds the
 * requested page size up to the nearest multiple of 3 (a Drupal Views constraint), and
 * applies cache tags for fine-grained on-demand revalidation per content type.
 *
 * @returns Flat list of `NodeUnion` items and the total un-paged item count.
 */
export const getViewPagedItems = async (
  viewId: string,
  displayId: string,
  pageSize?: Maybe<number>,
  contextualFilter?: Maybe<string[]>,
  page?: Maybe<number>,
  filter?: ViewFilter
): Promise<{items: NodeUnion[]; totalItems: number}> => {
  "use cache"

  // Drupal view page sizes must be multiples of 3; round up and cap at 99.
  const itemsPerPage = pageSize ? Math.min(Math.ceil(pageSize / 3) * 3, 99) : undefined

  // Map view IDs to targeted cache tags so only the affected listing is revalidated
  // when content of that type changes, rather than blowing the entire views cache.
  const viewCacheTag: Record<string, string> = {
    search: "views:all",
    stanford_shared_tags: "views:all",
    stanford_basic_pages: "views:stanford_page",
    stanford_courses: "views:stanford_course",
    stanford_events: "views:stanford_event",
    stanford_news: "views:stanford_news",
    stanford_person: "views:stanford_person",
    stanford_publications: "views:stanford_publication",
  }
  cacheTag("views", viewCacheTag[viewId] ?? "views:all")

  const client = graphqlClient()

  try {
    switch (`${viewId}--${displayId}`) {
      case "search--search": {
        const {search} = await client.request<SearchQuery>(SearchDocument, {
          filter: filter as SearchFilterInput,
          pageSize: itemsPerPage,
          page,
        })
        return pluckViewResult(search)
      }

      case "stanford_basic_pages--card_grid_alpha":
      case "stanford_basic_pages--basic_page_type_list":
      case "stanford_basic_pages--viewfield_block_1": {
        const cf = buildContextualFilters(["term_node_taxonomy_name_depth"], contextualFilter)
        const {stanfordBasicPages} = await client.request<StanfordBasicPagesQuery>(StanfordBasicPagesDocument, {
          contextualFilters: cf,
          pageSize: itemsPerPage,
          // card_grid_alpha shows pages in alphabetical title order.
          sortKey: displayId === "card_grid_alpha" ? StanfordBasicPagesSortKeys.Title : undefined,
          page,
        })
        return pluckViewResult(stanfordBasicPages)
      }

      case "stanford_courses--default_list_viewfield_block":
      case "stanford_courses--vertical_teaser_viewfield_block":
      case "courses_filtered--list":
      case "courses_filtered--card_grid": {
        const cf = buildContextualFilters(["term_node_taxonomy_name_depth"], contextualFilter)
        const {stanfordCourses} = await client.request<StanfordCoursesQuery>(StanfordCoursesDocument, {
          contextualFilters: cf,
          filter,
          pageSize: itemsPerPage,
          page,
        })
        return pluckViewResult(stanfordCourses)
      }

      case "stanford_events--cards":
      case "stanford_events--list_page": {
        // Events support up to four cascading taxonomy depth levels as contextual filters.
        const cf = buildContextualFilters(
          [
            "term_node_taxonomy_name_depth",
            "term_node_taxonomy_name_depth_1",
            "term_node_taxonomy_name_depth_2",
            "term_node_taxonomy_name_depth_3",
          ],
          contextualFilter
        )
        const {stanfordEvents} = await client.request<StanfordEventsQuery>(StanfordEventsDocument, {
          contextualFilters: cf,
          pageSize: itemsPerPage,
          page,
        })
        return pluckViewResult(stanfordEvents)
      }

      case "stanford_events--past_events_list_block": {
        const cf = buildContextualFilters(["term_node_taxonomy_name_depth"], contextualFilter)
        const {stanfordEventsPastEvents} = await client.request<StanfordEventsPastEventsQuery>(
          StanfordEventsPastEventsDocument,
          {contextualFilters: cf, pageSize: itemsPerPage, page}
        )
        return pluckViewResult(stanfordEventsPastEvents)
      }

      case "stanford_news_filtered--spotlight_cards":
      case "stanford_news--block_1":
      case "stanford_news--vertical_cards":
      case "stanford_news--spotlight_card_grid":
      case "stanford_news--spotlight_card_grid_no_date": {
        const cf = buildContextualFilters(["term_node_taxonomy_name_depth"], contextualFilter)
        // Spotlight display variants pass a "layout" discriminator so Drupal can apply
        // spotlight-specific query alterations server-side.
        const newsFilter = {...filter, layout: displayId.includes("spotlight") ? "news_spotlight" : ""}
        const {stanfordNews} = await client.request<StanfordNewsQuery>(StanfordNewsDocument, {
          contextualFilters: cf,
          filter: newsFilter,
          pageSize: itemsPerPage,
          page,
        })
        return pluckViewResult(stanfordNews)
      }

      case "stanford_opportunities--cards":
      case "stanford_opportunities--list":
      case "stanford_opportunities_filtered--list_page":
      case "stanford_opportunities_filtered--cards": {
        const cf = buildContextualFilters(["term_node_taxonomy_name_depth"], contextualFilter)
        const {stanfordOpportunities} = await client.request<StanfordOpportunitiesQuery>(
          StanfordOpportunitiesDocument,
          {contextualFilters: cf, filter, pageSize: itemsPerPage, page}
        )
        return pluckViewResult(stanfordOpportunities)
      }

      case "stanford_person--grid_list_all":
      case "people_filtered--grid_list_all": {
        const cf = buildContextualFilters(["term_node_taxonomy_name_depth"], contextualFilter)
        const {stanfordPerson} = await client.request<StanfordPersonQuery>(StanfordPersonDocument, {
          contextualFilters: cf,
          filter,
          pageSize: itemsPerPage,
          page,
        })
        return pluckViewResult(stanfordPerson)
      }

      case "stanford_publications--apa_list":
      case "stanford_publications--chicago_list": {
        const cf = buildContextualFilters(["term_node_taxonomy_name_depth"], contextualFilter)
        const {stanfordPublications} = await client.request<StanfordPublicationsQuery>(StanfordPublicationsDocument, {
          contextualFilters: cf,
          pageSize: itemsPerPage,
          page,
        })
        return pluckViewResult(stanfordPublications)
      }

      case "stanford_shared_tags--card_grid": {
        // Shared-tags views filter by both taxonomy depth and content type.
        const cf = buildContextualFilters(["term_node_taxonomy_name_depth", "type"], contextualFilter)
        const {stanfordSharedTags} = await client.request<StanfordSharedTagsQuery>(StanfordSharedTagsDocument, {
          contextualFilters: cf,
          pageSize: itemsPerPage,
          page,
        })
        return pluckViewResult(stanfordSharedTags)
      }

      case "media_content--list":
      case "media_content--card_grid":
      case "media_filtered--default_list":
      case "media_filtered--card_grid": {
        const cf = buildContextualFilters(["term_node_taxonomy_name_depth"], contextualFilter)
        const {stanfordMedia} = await client.request<StanfordMediaQuery>(StanfordMediaDocument, {
          contextualFilters: cf,
          filter,
          pageSize: itemsPerPage,
          page,
        })
        return pluckViewResult(stanfordMedia)
      }

      default:
        console.warn(`Unable to find query for view: ${viewId} display: ${displayId}`)
        return {items: [], totalItems: 0}
    }
  } catch (e) {
    if (e instanceof Error) console.warn(e.message)
    return {items: [], totalItems: 0}
  }
}

/**
 * Extracts `items` and `totalItems` from a Drupal view result field.
 *
 * Every view query response shares the same `results` / `pageInfo` shape, so this helper
 * centralises the extraction and the cast to `NodeUnion[]` instead of repeating it in
 * every switch case.
 */
const pluckViewResult = <T,>(view: {results: T[]; pageInfo: Pick<ViewPageInfo, "total">} | null | undefined) => ({
  items: (view?.results ?? []) as NodeUnion[],
  totalItems: view?.pageInfo.total ?? 0,
})

/**
 * Zips positional `values` with `keys` into a Drupal contextual filter object, omitting
 * any positions where the value is absent or blank. An optional `defaults` map is merged
 * in last so callers can supply baseline values.
 *
 * Returns `undefined` when no values are provided, which tells Drupal to apply no
 * contextual filtering for this request.
 */
const buildContextualFilters = (
  keys: string[],
  values?: Maybe<string[]>,
  defaults: Record<string, string | undefined> = {}
): Record<string, string | undefined> | undefined => {
  if (!values?.length) return undefined

  const filters: Record<string, string | undefined> = {}
  keys.forEach((key, i) => {
    const val = values[i]?.trim()
    if (val) filters[key] = val
  })

  return {...defaults, ...filters}
}
