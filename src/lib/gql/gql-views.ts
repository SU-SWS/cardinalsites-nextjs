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
  SearchDocument,
  SearchQuery,
  SearchQueryVariables,
  StanfordBasicPagesDocument,
  StanfordBasicPagesQuery,
  StanfordBasicPagesQueryVariables,
  StanfordBasicPagesSortKeys,
  StanfordCoursesDocument,
  StanfordCoursesQuery,
  StanfordCoursesQueryVariables,
  StanfordEventsDocument,
  StanfordEventsQuery,
  StanfordEventsQueryVariables,
  StanfordEventsPastEventsDocument,
  StanfordEventsPastEventsQuery,
  StanfordEventsPastEventsQueryVariables,
  StanfordMediaDocument,
  StanfordMediaQuery,
  StanfordMediaQueryVariables,
  StanfordNewsDocument,
  StanfordNewsQuery,
  StanfordNewsQueryVariables,
  StanfordOpportunitiesDocument,
  StanfordOpportunitiesQuery,
  StanfordOpportunitiesQueryVariables,
  StanfordPersonDocument,
  StanfordPersonQuery,
  StanfordPersonQueryVariables,
  StanfordPublicationsDocument,
  StanfordPublicationsQuery,
  StanfordPublicationsQueryVariables,
  StanfordSharedTagsDocument,
  StanfordSharedTagsQuery,
  StanfordSharedTagsQueryVariables,
  SearchFilterInput,
} from "@lib/gql/__generated__/graphql"
import {graphqlClient} from "@lib/gql/gql-client"
import {cacheFailure} from "@lib/gql/gql-queries"

export const VIEW_PAGE_SIZE = 21

export type ViewFilter = Maybe<Record<string, string | number | Array<string | number>>>

/** Every view display this site queries. Anything else is rejected before it reaches Drupal or the cache. */
const SUPPORTED_DISPLAYS = new Set([
  "search--search",
  "stanford_basic_pages--card_grid_alpha",
  "stanford_basic_pages--basic_page_type_list",
  "stanford_basic_pages--viewfield_block_1",
  "stanford_courses--default_list_viewfield_block",
  "stanford_courses--vertical_teaser_viewfield_block",
  "courses_filtered--list",
  "courses_filtered--card_grid",
  "stanford_events--cards",
  "stanford_events--list_page",
  "stanford_events--past_events_list_block",
  "stanford_news_filtered--spotlight_cards",
  "stanford_news--block_1",
  "stanford_news--vertical_cards",
  "stanford_news--spotlight_card_grid",
  "stanford_news--spotlight_card_grid_no_date",
  "stanford_opportunities--cards",
  "stanford_opportunities--list",
  "stanford_opportunities_filtered--list_page",
  "stanford_opportunities_filtered--cards",
  "stanford_person--grid_list_all",
  "people_filtered--grid_list_all",
  "stanford_publications--apa_list",
  "stanford_publications--chicago_list",
  "stanford_shared_tags--card_grid",
  "media_content--list",
  "media_content--card_grid",
  "media_filtered--default_list",
  "media_filtered--card_grid",
])

/** The free-text search keyword, and the term-id filters the filtered lists send (see `filterKey`). */
const TEXT_FILTER = "key"
const TERM_FILTERS = ["filter", "filters", "spotlight"]
const MAX_PAGE = 100
const MAX_TEXT_LENGTH = 100
const MAX_CONTEXTUAL_FILTERS = 4
const MAX_TERMS = 50
// Drupal term ids: numeric ids or uuids. Anything else is not a real filter option.
const TERM_ID = /^[\w-]{1,64}$/

/** Whether a request carries visitor-chosen filters, whose combinations are too many to cache forever. */
const _hasVisitorFilter = (filter?: ViewFilter) =>
  !!filter &&
  ((typeof filter[TEXT_FILTER] === "string" && filter[TEXT_FILTER].length > 0) ||
    TERM_FILTERS.some(key => Array.isArray(filter[key]) && (filter[key] as unknown[]).length > 0))

/**
 * Validate a view request that came from the browser.
 *
 * The "load more" server action is a public endpoint, and every distinct set of arguments is a Drupal
 * query and a cache entry. Only displays the site uses are allowed, numbers are clamped, and filters are
 * limited to known keys: a short keyword (trimmed and lowercased, so equivalent searches share a cache
 * entry) and lists of term ids.
 *
 * @returns The arguments to pass to {@link getViewPagedItems}, or `undefined` to reject the request.
 */
export const sanitizeViewRequest = (
  viewId: unknown,
  displayId: unknown,
  pageSize: unknown,
  contextualFilter: unknown,
  page: unknown,
  filter: unknown
): Parameters<typeof getViewPagedItems> | undefined => {
  if (typeof viewId !== "string" || typeof displayId !== "string") return
  if (!SUPPORTED_DISPLAYS.has(`${viewId}--${displayId}`)) return

  const toInt = (value: unknown, min: number, max: number, fallback: number) =>
    typeof value === "number" && Number.isFinite(value) ? Math.min(Math.max(Math.trunc(value), min), max) : fallback

  const contextual = Array.isArray(contextualFilter)
    ? contextualFilter
        .slice(0, MAX_CONTEXTUAL_FILTERS)
        .filter((value): value is string => typeof value === "string")
        .map(value => value.trim().slice(0, MAX_TEXT_LENGTH))
    : undefined

  let cleanFilter: Record<string, string | string[]> | undefined
  if (filter && typeof filter === "object") {
    const input = filter as Record<string, unknown>
    cleanFilter = {}

    const keyword = input[TEXT_FILTER]
    if (typeof keyword === "string" && keyword.trim()) {
      cleanFilter[TEXT_FILTER] = keyword.trim().slice(0, MAX_TEXT_LENGTH).toLowerCase()
    }

    for (const key of TERM_FILTERS) {
      const values = input[key]
      if (!Array.isArray(values)) continue
      const ids = [...new Set(values.map(String).filter(id => TERM_ID.test(id)))].sort().slice(0, MAX_TERMS)
      if (ids.length) cleanFilter[key] = ids
    }
  }

  return [
    viewId,
    displayId,
    toInt(pageSize, 1, VIEW_PAGE_SIZE, VIEW_PAGE_SIZE),
    contextual,
    toInt(page, 0, MAX_PAGE, 0),
    cleanFilter,
  ]
}

export const getViewPagedItems = async (
  viewId: string,
  displayId: string,
  pageSize?: Maybe<number>,
  contextualFilter?: Maybe<string[]>,
  page?: Maybe<number>,
  filter?: ViewFilter
): Promise<{items: NodeUnion[]; totalItems: number}> => {
  let items: NodeUnion[] = []
  let totalItems = 0
  // View filters allow multiples of 3 for page sizes. If the user wants 4, we'll fetch 6 and then slice it at the end.
  const itemsPerPage = pageSize ? Math.min(Math.ceil(pageSize / 3) * 3, 99) : undefined

  const _viewTags: Record<string, string> = {
    search: "views:all",
    stanford_shared_tags: "views:all",
    stanford_basic_pages: "views:stanford_page",
    stanford_courses: "views:stanford_course",
    stanford_events: "views:stanford_event",
    stanford_news: "views:stanford_news",
    stanford_person: "views:stanford_person",
    stanford_publications: "views:stanford_publication",
  }
  const client = graphqlClient()
  let contextualFilters = getContextualFilters(["term_node_taxonomy_name_depth"], contextualFilter)
  let graphqlResponse
  let sortKey

  try {
    switch (`${viewId}--${displayId}`) {
      case "search--search":
        graphqlResponse = await client.request<SearchQuery, SearchQueryVariables>(SearchDocument, {
          filter: filter as SearchFilterInput,
          pageSize: itemsPerPage,
          page,
        })
        items = graphqlResponse.search?.results as unknown as NodeUnion[]
        totalItems = graphqlResponse.search?.pageInfo.total || 0
        break

      case "stanford_basic_pages--card_grid_alpha":
        sortKey = StanfordBasicPagesSortKeys["Title"]

      case "stanford_basic_pages--basic_page_type_list":
      case "stanford_basic_pages--viewfield_block_1":
        contextualFilters = getContextualFilters(["term_node_taxonomy_name_depth"], contextualFilter)
        graphqlResponse = await client.request<StanfordBasicPagesQuery, StanfordBasicPagesQueryVariables>(
          StanfordBasicPagesDocument,
          {
            contextualFilters,
            pageSize: itemsPerPage,
            sortKey,
            page,
          }
        )
        items = graphqlResponse.stanfordBasicPages?.results as unknown as NodeStanfordPage[]
        totalItems = graphqlResponse.stanfordBasicPages?.pageInfo.total || 0
        break

      case "stanford_courses--default_list_viewfield_block":
      case "stanford_courses--vertical_teaser_viewfield_block":
      case "courses_filtered--list":
      case "courses_filtered--card_grid":
        graphqlResponse = await client.request<StanfordCoursesQuery, StanfordCoursesQueryVariables>(
          StanfordCoursesDocument,
          {
            contextualFilters,
            filter,
            pageSize: itemsPerPage,
            page,
          }
        )
        items = graphqlResponse.stanfordCourses?.results as unknown as NodeStanfordCourse[]
        totalItems = graphqlResponse.stanfordCourses?.pageInfo.total || 0
        break

      case "stanford_events--cards":
      case "stanford_events--list_page":
        contextualFilters = getContextualFilters(
          [
            "term_node_taxonomy_name_depth",
            "term_node_taxonomy_name_depth_1",
            "term_node_taxonomy_name_depth_2",
            "term_node_taxonomy_name_depth_3",
          ],
          contextualFilter
        )
        graphqlResponse = await client.request<StanfordEventsQuery, StanfordEventsQueryVariables>(
          StanfordEventsDocument,
          {
            contextualFilters,
            pageSize: itemsPerPage,
            page,
          }
        )
        items = graphqlResponse.stanfordEvents?.results as unknown as NodeStanfordEvent[]
        totalItems = graphqlResponse.stanfordEvents?.pageInfo.total || 0
        break

      case "stanford_events--past_events_list_block":
        graphqlResponse = await client.request<StanfordEventsPastEventsQuery, StanfordEventsPastEventsQueryVariables>(
          StanfordEventsPastEventsDocument,
          {
            contextualFilters,
            pageSize: itemsPerPage,
            page,
          }
        )
        items = graphqlResponse.stanfordEventsPastEvents?.results as unknown as NodeStanfordEvent[]
        totalItems = graphqlResponse.stanfordEventsPastEvents?.pageInfo.total || 0
        break

      case "stanford_news_filtered--spotlight_cards":
      case "stanford_news--block_1":
      case "stanford_news--vertical_cards":
      case "stanford_news--spotlight_card_grid":
      case "stanford_news--spotlight_card_grid_no_date":
        const filters = {...filter, layout: displayId.includes("spotlight") ? "news_spotlight" : ""}
        graphqlResponse = await client.request<StanfordNewsQuery, StanfordNewsQueryVariables>(StanfordNewsDocument, {
          contextualFilters,
          filter: filters,
          pageSize: itemsPerPage,
          page,
        })
        items = graphqlResponse.stanfordNews?.results as unknown as NodeStanfordNews[]
        totalItems = graphqlResponse.stanfordNews?.pageInfo.total || 0
        break

      case "stanford_opportunities--cards":
      case "stanford_opportunities--list":
      case "stanford_opportunities_filtered--list_page":
      case "stanford_opportunities_filtered--cards":
        graphqlResponse = await client.request<StanfordOpportunitiesQuery, StanfordOpportunitiesQueryVariables>(
          StanfordOpportunitiesDocument,
          {
            contextualFilters,
            filter,
            pageSize: itemsPerPage,
            page,
          }
        )
        items = graphqlResponse.stanfordOpportunities?.results as unknown as NodeStanfordOpportunity[]
        totalItems = graphqlResponse.stanfordOpportunities?.pageInfo.total || 0
        break

      case "stanford_person--grid_list_all":
      case "people_filtered--grid_list_all":
        graphqlResponse = await client.request<StanfordPersonQuery, StanfordPersonQueryVariables>(
          StanfordPersonDocument,
          {
            contextualFilters,
            filter,
            pageSize: itemsPerPage,
            page,
          }
        )
        items = graphqlResponse.stanfordPerson?.results as unknown as NodeStanfordPerson[]
        totalItems = graphqlResponse.stanfordPerson?.pageInfo.total || 0
        break

      case "stanford_publications--apa_list":
      case "stanford_publications--chicago_list":
        graphqlResponse = await client.request<StanfordPublicationsQuery, StanfordPublicationsQueryVariables>(
          StanfordPublicationsDocument,
          {
            contextualFilters,
            pageSize: itemsPerPage,
            page,
          }
        )
        items = graphqlResponse.stanfordPublications?.results as unknown as NodeStanfordPublication[]
        totalItems = graphqlResponse.stanfordPublications?.pageInfo.total || 0
        break

      case "stanford_shared_tags--card_grid":
        contextualFilters = getContextualFilters(["term_node_taxonomy_name_depth", "type"], contextualFilter)
        graphqlResponse = await client.request<StanfordSharedTagsQuery, StanfordSharedTagsQueryVariables>(
          StanfordSharedTagsDocument,
          {
            contextualFilters,
            pageSize: itemsPerPage,
            page,
          }
        )
        items = graphqlResponse.stanfordSharedTags?.results as unknown as NodeUnion[]
        totalItems = graphqlResponse.stanfordSharedTags?.pageInfo.total || 0
        break

      case "media_content--list":
      case "media_content--card_grid":
      case "media_filtered--default_list":
      case "media_filtered--card_grid":
        contextualFilters = getContextualFilters(["term_node_taxonomy_name_depth"], contextualFilter)
        graphqlResponse = await client.request<StanfordMediaQuery, StanfordMediaQueryVariables>(StanfordMediaDocument, {
          contextualFilters,
          filter,
          pageSize: itemsPerPage,
          page,
        })
        items = graphqlResponse.stanfordMedia?.results as unknown as NodeStanfordMedia[]
        totalItems = graphqlResponse.stanfordMedia?.pageInfo.total || 0
        break

      default:
        console.warn(`Unable to find query for view: ${viewId} display: ${displayId}`)
        break
    }
  } catch (e) {
    cacheFailure(`Unable to fetch view ${viewId}--${displayId}`, e)
    return {items: [], totalItems: 0}
  }

  return {items, totalItems}
}

const getContextualFilters = (
  keys: string[],
  values?: Maybe<string[]>,
  defaults: Record<string, string | undefined> = {}
) => {
  if (!keys || !values) return
  const filters: Record<string, string | undefined> = keys.reduce(
    (obj, key, index) => ({
      ...obj,
      [key]: values[index]?.trim(),
    }),
    {}
  )
  Object.keys(filters).forEach(key => filters[key] === undefined && delete filters[key])
  return {...defaults, ...filters}
}
