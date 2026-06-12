"use cache: remote"

import {
  AllNodesQuery,
  AllNodesQueryVariables,
  ConfigPagesQuery,
  ConfigPagesUnion,
  CourseFiltersTermsDocument,
  CourseFiltersTermsQuery,
  EventFiltersTermsDocument,
  EventFiltersTermsQuery,
  MediaContentFiltersTermsDocument,
  MediaContentFiltersTermsQuery,
  MenuAvailable,
  MenuItem,
  MenuDocument,
  MenuQuery,
  NewsSpotlightFiltersTermsDocument,
  NewsSpotlightFiltersTermsQuery,
  NodeUnion,
  OpportunityFiltersTermsDocument,
  OpportunityFiltersTermsQuery,
  PersonFiltersTermsDocument,
  PersonFiltersTermsQuery,
  PublicationFiltersTermsDocument,
  PublicationFiltersTermsQuery,
  RouteQuery,
  RouteRedirect,
  StanfordBasicSiteSetting,
  TermInterface,
  AllNodesDocument,
  ConfigPagesDocument,
  RouteDocument,
  AllRedirectsQuery,
  AllRedirectsDocument,
} from "@lib/gql/__generated__/graphql"
import {graphqlClient} from "@lib/gql/gql-client"
import {ClientError} from "graphql-request"
import {GraphQLError} from "graphql/error"
import {cacheTag} from "next/dist/server/use-cache/cache-tag"
import {FilterGroup} from "@components/views/filtered-list-view/filtered-list-view.client"
import {FilterVocabs} from "@lib/gql/filter-vocabs"

/** Drupal GraphQL errors include a `debugMessage` field in addition to the standard `message`. */
type DrupalGraphqlError = GraphQLError & {debugMessage: string}

/**
 * Resolve a Drupal path to its entity or a redirect URL.
 *
 * @param path         Site-relative path (e.g. `/about/team`).
 * @param previewMode  When `true`, uses admin credentials so unpublished content is visible.
 * @param teaser       When `true`, Drupal returns a reduced field set suitable for list views.
 *
 * @returns `{ entity }` for real pages, `{ redirect }` for 3xx routes, or `{}` on error.
 */
export const getEntityFromPath = async <T extends NodeUnion>(
  path: string,
  previewMode?: boolean,
  teaser?: boolean
): Promise<{
  entity?: T
  redirect?: RouteRedirect["url"]
}> => {
  cacheTag("all-entities", "paths", `paths:${path}`)

  let query: RouteQuery

  try {
    query = await graphqlClient(undefined, previewMode).request<RouteQuery>(RouteDocument, {
      path,
      teaser: !!teaser,
    })
  } catch (e) {
    if (e instanceof ClientError) {
      // The Drupal GraphQL module attaches a human-readable `debugMessage` alongside the
      // standard `message`. Deduplicate in case multiple errors carry the same text.
      // @ts-expect-error Client error type doesn't define debugMessage, but Drupal includes it.
      const messages = e.response.errors?.map((error: DrupalGraphqlError) => error.debugMessage || error.message)
      console.warn([...new Set(messages)].join(" "))
    } else {
      console.warn(e instanceof Error ? e.message : "An error occurred")
    }
    return {}
  }

  if (query.route?.__typename === "RouteRedirect") return {redirect: query.route.url}

  // RouteInternal carries the resolved Drupal entity; cast to the caller's expected node type.
  const entity: T | undefined =
    query.route?.__typename === "RouteInternal" && query.route.entity ? (query.route.entity as T) : undefined

  return {entity}
}

/**
 * Fetch the first config-page node of the given Drupal bundle type.
 *
 * Config pages are singleton site-wide settings bundles (e.g. `StanfordBasicSiteSetting`).
 * All bundles are loaded in a single `ConfigPages` request; the caller specifies which bundle
 * to return by its `__typename`.
 *
 * @param configPageType  The `__typename` of the desired config-page bundle.
 * @returns The typed config-page node, or `undefined` if not found.
 */
export const getConfigPage = async <T extends ConfigPagesUnion>(
  configPageType: ConfigPagesUnion["__typename"]
): Promise<T | undefined> => {
  cacheTag("all-entities", "config-pages")

  let query: ConfigPagesQuery
  try {
    query = await graphqlClient().request<ConfigPagesQuery>(ConfigPagesDocument)
  } catch (e) {
    console.error("Unable to fetch config pages: " + (e instanceof Error && e.stack))
    return
  }

  // Each key of ConfigPagesQuery is a bundle connection (e.g. `stanfordBasicSiteSettings`).
  // Skip `__typename` and find the first bundle whose leading node matches the requested type.
  for (const queryKey of Object.keys(query) as (keyof ConfigPagesQuery)[]) {
    if (queryKey !== "__typename" && query[queryKey]?.nodes[0]?.__typename === configPageType) {
      return query[queryKey].nodes[0] as T
    }
  }
}

/**
 * Fetch a single field from a Drupal config-page bundle.
 *
 * Convenience wrapper around {@link getConfigPage} for callers that only need one field
 * rather than the full config-page object.
 *
 * @param configPageType  The `__typename` of the config-page bundle.
 * @param fieldName       The field to extract.
 */
export const getConfigPageField = async <T extends ConfigPagesUnion, F>(
  configPageType: ConfigPagesUnion["__typename"],
  fieldName: keyof T
): Promise<F | undefined> => {
  cacheTag("all-entities", "config-pages")

  const configPage = await getConfigPage<T>(configPageType)
  return configPage?.[fieldName] as F
}

/**
 * Fetch and clean a Drupal menu tree.
 *
 * Removes items whose title is `"Inaccessible"` (Drupal's placeholder for nodes the current
 * user cannot access), normalises the home-page URL alias back to `/`, and optionally caps the
 * returned depth.
 *
 * @param name       Drupal menu machine name (defaults to `MAIN` when omitted).
 * @param maxLevels  Maximum nesting depth to return. `0` returns only top-level items.
 */
export const getMenu = async (name?: MenuAvailable, maxLevels?: number): Promise<MenuItem[]> => {
  const homePath = await getHomePagePath()
  const menuName = name?.toLowerCase() ?? "main"
  cacheTag("all-entities", "menus", `menu:${menuName}`)

  let menuItems: MenuItem[] = []
  try {
    const menu = await graphqlClient().request<MenuQuery>(MenuDocument, {name})
    menuItems = (menu.menu?.items ?? []) as MenuItem[]
  } catch (_e) {
    console.error("Unable to fetch menu")
    return []
  }

  const filterInaccessible = (items: MenuItem[], level: number): MenuItem[] => {
    // Stop recursing once the caller's requested depth is reached.
    if ((maxLevels || maxLevels === 0) && level > maxLevels) return []

    items = items.filter(item => item.title !== "Inaccessible")

    // Normalise the home-page path alias so links always resolve to "/".
    items.forEach(item => {
      item.url = item.url === homePath ? "/" : item.url
    })
    items.forEach(item => (item.children = filterInaccessible(item.children, level + 1)))
    return items
  }
  return filterInaccessible(menuItems, 0)
}

/**
 * Fetch every published node across all content types for static-path generation.
 *
 * The `AllNodes` query returns up to 1 000 nodes per content type per page. This function
 * pages through all content types using per-type cursors until every type reports no next
 * page.
 *
 * @returns A flat array of all published `NodeUnion` nodes.
 */
export const getAllNodes = async () => {
  cacheTag("all-entities", "nodes")

  const nodes: NodeUnion[] = []
  let fetchMore = true
  const cursors: Omit<AllNodesQueryVariables, "first"> = {}

  while (fetchMore) {
    const nodeQuery = await graphqlClient().request<AllNodesQuery>(AllNodesDocument, {first: 1000, ...cursors})
    const queryKeys = Object.keys(nodeQuery) as (keyof AllNodesQuery)[]
    fetchMore = false

    queryKeys.forEach(queryKey => {
      if (queryKey === "__typename") return

      nodeQuery[queryKey]?.nodes.forEach(node => nodes.push(node as NodeUnion))

      // Advance the cursor for this content type so the next iteration fetches the next page.
      if (nodeQuery[queryKey].pageInfo.endCursor) cursors[queryKey] = nodeQuery[queryKey].pageInfo.endCursor
      if (nodeQuery[queryKey].pageInfo.hasNextPage) fetchMore = true
    })
  }

  return nodes
}

export const getAllRedirectPaths = async () => {
  cacheTag("all-entities", "redirects")

  const paths: Array<string> = []
  let fetchMore = true
  let after = undefined

  while (fetchMore) {
    // Need to act like it's in preview mode to bypass access restriction.
    const redirectsQuery: AllRedirectsQuery = await graphqlClient(undefined, true).request<AllRedirectsQuery>(
      AllRedirectsDocument,
      {
        first: 1000,
        after,
      }
    )

    redirectsQuery.redirects.nodes.forEach(redirect => paths.push(redirect.redirectSource.url))

    after = redirectsQuery.redirects.pageInfo.endCursor
    fetchMore = redirectsQuery.redirects.pageInfo.hasNextPage
  }

  return paths
}

/**
 * Retrieve Algolia search credentials, preferring environment variables over CMS config values.
 *
 * Returns `[appId, indexName, apiKey]` when credentials are available, or an empty array when
 * Algolia is not configured. Emits a warning when credentials are sourced from the CMS rather
 * than environment variables, since storing API keys in the database is discouraged.
 *
 * Environment variables (checked first):
 * - `ALGOLIA_ID`    — Algolia Application ID
 * - `ALGOLIA_INDEX` — Index name
 * - `ALGOLIA_KEY`   — Search-only API key
 */
export const getAlgoliaCredential = async () => {
  cacheTag("all-entities", "algolia", "config-pages")

  if (process.env.ALGOLIA_ID && process.env.ALGOLIA_INDEX && process.env.ALGOLIA_KEY) {
    return [process.env.ALGOLIA_ID, process.env.ALGOLIA_INDEX, process.env.ALGOLIA_KEY]
  }

  // Fall back to the Drupal config page — fetch it once to avoid multiple round-trips.
  const configPage = await getConfigPage<StanfordBasicSiteSetting>("StanfordBasicSiteSetting")
  if (!configPage?.suSiteAlgoliaUi) return []

  const {suSiteAlgoliaId: appId, suSiteAlgoliaIndex: indexName, suSiteAlgoliaSearch: apiKey} = configPage
  if (appId) console.warn("It is recommended to set environment variables for Algolia credentials.")

  return appId && indexName && apiKey ? [appId, indexName, apiKey] : []
}

/**
 * Return the resolved path of the site's home page node.
 *
 * Drupal may assign a path alias to the front page (e.g. `/home`). This function resolves
 * it once so callers can normalise menu URLs that would otherwise point to the alias instead
 * of `/`.
 */
export const getHomePagePath = async () => {
  cacheTag("all-entities", "paths:/")

  const {entity} = await getEntityFromPath("/")
  return entity?.path
}

/**
 * Fetch the flat list of taxonomy terms for a given filter vocabulary.
 *
 * Each vocabulary corresponds to a Drupal taxonomy used as a filterable facet on a view.
 * Terms are returned as `TermInterface` regardless of the concrete bundle type, since
 * callers only need `id`, `name`, `weight`, and `parent`.
 *
 * @param vocab  The vocabulary to query, as defined in {@link FilterVocabs}.
 */
export const getFilterTerms = async (vocab: FilterVocabs): Promise<Array<TermInterface>> => {
  cacheTag("all-entities", "taxonomy", `taxonomy:${vocab}`)

  switch (vocab) {
    case FilterVocabs.Courses:
      return (await graphqlClient().request<CourseFiltersTermsQuery>(CourseFiltersTermsDocument)).termCourseFilters
        .nodes as unknown as TermInterface[]

    case FilterVocabs.Events:
      return (await graphqlClient().request<EventFiltersTermsQuery>(EventFiltersTermsDocument)).termEventFilters
        .nodes as unknown as TermInterface[]

    case FilterVocabs.Media:
      return (await graphqlClient().request<MediaContentFiltersTermsQuery>(MediaContentFiltersTermsDocument))
        .termMediaContentFilters.nodes as unknown as TermInterface[]

    case FilterVocabs.News:
      return (await graphqlClient().request<NewsSpotlightFiltersTermsQuery>(NewsSpotlightFiltersTermsDocument))
        .termStanfordNewsSpotlightFilters.nodes as unknown as TermInterface[]

    case FilterVocabs.Opportunities:
      return (await graphqlClient().request<OpportunityFiltersTermsQuery>(OpportunityFiltersTermsDocument))
        .termOpportunityTagFilters.nodes as unknown as TermInterface[]

    case FilterVocabs.People:
      return (await graphqlClient().request<PersonFiltersTermsQuery>(PersonFiltersTermsDocument)).termPersonFilters
        .nodes as unknown as TermInterface[]

    case FilterVocabs.Publications:
      return (await graphqlClient().request<PublicationFiltersTermsQuery>(PublicationFiltersTermsDocument))
        .termPublicationFilters.nodes as unknown as TermInterface[]
  }
  return []
}

/**
 * Build the grouped filter options for a view's filter sidebar.
 *
 * Drupal filter taxonomies use a two-level hierarchy:
 * - **Group terms** (root level — no parent in the vocab) — rendered as section headings.
 * - **Option terms** (children) — rendered as checkboxes beneath their group.
 *
 * Terms are sorted by Drupal `weight` before grouping.
 *
 * @param vocab  The vocabulary to build filter groups for.
 * @returns An array of `FilterGroup` objects, each with a `label` and its child `options`.
 */
export const getTermFilterGroups = async (vocab: FilterVocabs): Promise<Array<FilterGroup>> => {
  const filterTerms = await getFilterTerms(vocab)

  // Root-level terms are those whose parent UUID does not match any term in the flat list.
  // These become the group headings; their direct children become the selectable options.
  const groupTerms = filterTerms
    .sort((a, b) => a.weight - b.weight)
    .filter(term => !filterTerms.find(t => t.uuid === term.parent?.uuid))

  const filters: Array<FilterGroup> = []
  groupTerms.forEach(groupTerm => {
    filters.push({
      label: groupTerm.name,
      options: filterTerms
        .filter(term => term.parent?.uuid === groupTerm.uuid)
        .map(term => ({
          value: term.id,
          label: term.name,
        })),
    })
  })
  return filters
}
