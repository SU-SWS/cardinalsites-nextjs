"use cache"

import {
  AllNodesQuery,
  AllNodesQueryVariables,
  ConfigPagesQuery,
  ConfigPagesUnion,
  MenuAvailable,
  MenuItem,
  MenuQuery,
  NodeUnion,
  RouteQuery,
  RouteRedirect,
  StanfordBasicSiteSetting,
  TermInterface,
} from "@lib/gql/__generated__/drupal.d"
import {graphqlClient} from "@lib/gql/gql-client"
import {ClientError} from "graphql-request"
import {GraphQLError} from "graphql/error"
import {cacheTag} from "next/dist/server/use-cache/cache-tag"
import {FilterGroup} from "@components/views/filtered-list-view/filtered-list-view.client"
import {FilterVocabs} from "@lib/gql/filter-vocabs"
import {cacheLife} from "next/dist/server/use-cache/cache-life"

type DrupalGraphqlError = GraphQLError & {debugMessage: string}

export const getEntityFromPath = async <T extends NodeUnion>(
  path: string,
  previewMode?: boolean,
  teaser?: boolean
): Promise<{
  entity?: T
  redirect?: RouteRedirect["url"]
}> => {
  cacheTag(`paths:${path}`, "all-entities")
  cacheLife("max")

  let query: RouteQuery

  try {
    query = await graphqlClient(undefined, previewMode).Route({
      path,
      teaser: !!teaser,
    })
  } catch (e) {
    if (e instanceof ClientError) {
      // @ts-expect-error Client error type doesn't define the debugMessage, but it's there.
      const messages = e.response.errors?.map((error: DrupalGraphqlError) => error.debugMessage || error.message)
      console.warn([...new Set(messages)].join(" "))
    } else {
      console.warn(e instanceof Error ? e.message : "An error occurred")
    }
    return {}
  }

  if (query.route?.__typename === "RouteRedirect") return {redirect: query.route.url}
  const entity: T | undefined =
    query.route?.__typename === "RouteInternal" && query.route.entity ? (query.route.entity as T) : undefined

  return {entity}
}

export const getConfigPage = async <T extends ConfigPagesUnion>(
  configPageType: ConfigPagesUnion["__typename"]
): Promise<T | undefined> => {
  cacheTag("config-pages")
  cacheLife("max")
  let query: ConfigPagesQuery
  try {
    query = await graphqlClient().ConfigPages()
  } catch (e) {
    console.error("Unable to fetch config pages: " + (e instanceof Error && e.stack))
    return
  }

  const queryKeys = Object.keys(query) as (keyof ConfigPagesQuery)[]
  for (let i = 0; i < queryKeys.length; i++) {
    const queryKey = queryKeys[i]
    if (queryKey !== "__typename" && query[queryKey]?.nodes[0]?.__typename === configPageType) {
      return query[queryKey].nodes[0] as T
    }
  }
}

export const getConfigPageField = async <T extends ConfigPagesUnion, F>(
  configPageType: ConfigPagesUnion["__typename"],
  fieldName: keyof T
): Promise<F | undefined> => {
  cacheTag("config-pages")
  cacheLife("max")

  const configPage = await getConfigPage<T>(configPageType)
  return configPage?.[fieldName] as F
}

export const getMenu = async (name?: MenuAvailable, maxLevels?: number): Promise<MenuItem[]> => {
  const homePath = await getHomePagePath()
  const menuName = name?.toLowerCase() || "main"
  cacheTag("menus", `menu:${menuName}`)
  cacheLife("max")

  let menu: MenuQuery = {}
  let menuItems: MenuItem[] = []
  try {
    menu = await graphqlClient().Menu({name})
    menuItems = (menu.menu?.items || []) as MenuItem[]
  } catch (_e) {
    console.error("Unable to fetch menu")
    return []
  }

  const filterInaccessible = (items: MenuItem[], level: number): MenuItem[] => {
    if ((maxLevels || maxLevels === 0) && level > maxLevels) return []
    items = items.filter(item => item.title !== "Inaccessible")

    // Fix the home page path to make sure it's not the path alias.
    items.map(item => {
      item.url = item.url === homePath ? "/" : item.url
    })
    items.map(item => (item.children = filterInaccessible(item.children, level + 1)))
    return items
  }
  return filterInaccessible(menuItems, 0)
}

export const getAllNodes = async () => {
  cacheTag("all-entities")
  cacheLife("max")

  const nodes: NodeUnion[] = []
  let fetchMore = true
  let nodeQuery: AllNodesQuery
  let queryKeys: (keyof AllNodesQuery)[] = []
  const cursors: Omit<AllNodesQueryVariables, "first"> = {}

  while (fetchMore) {
    nodeQuery = await graphqlClient().AllNodes({first: 1000, ...cursors})
    queryKeys = Object.keys(nodeQuery) as (keyof AllNodesQuery)[]
    fetchMore = false

    queryKeys.map(queryKey => {
      if (queryKey === "__typename") return

      nodeQuery[queryKey]?.nodes.map(node => nodes.push(node as NodeUnion))

      if (nodeQuery[queryKey].pageInfo.endCursor) cursors[queryKey] = nodeQuery[queryKey].pageInfo.endCursor
      if (nodeQuery[queryKey].pageInfo.hasNextPage) fetchMore = true
    })
  }

  return nodes
}

/**
 * If environment variables are available, return those. If not, fetch from the config page.
 */
export const getAlgoliaCredential = async () => {
  cacheTag("algolia", "config-pages")
  cacheLife("max")

  if (process.env.ALGOLIA_ID && process.env.ALGOLIA_INDEX && process.env.ALGOLIA_KEY) {
    return [process.env.ALGOLIA_ID, process.env.ALGOLIA_INDEX, process.env.ALGOLIA_KEY]
  }
  const useAlgolia = await getConfigPageField<StanfordBasicSiteSetting, StanfordBasicSiteSetting["suSiteAlgoliaUi"]>(
    "StanfordBasicSiteSetting",
    "suSiteAlgoliaUi"
  )
  if (!useAlgolia) return []

  const appId = await getConfigPageField<StanfordBasicSiteSetting, StanfordBasicSiteSetting["suSiteAlgoliaId"]>(
    "StanfordBasicSiteSetting",
    "suSiteAlgoliaId"
  )
  const indexName = await getConfigPageField<StanfordBasicSiteSetting, StanfordBasicSiteSetting["suSiteAlgoliaIndex"]>(
    "StanfordBasicSiteSetting",
    "suSiteAlgoliaIndex"
  )
  const apiKey = await getConfigPageField<StanfordBasicSiteSetting, StanfordBasicSiteSetting["suSiteAlgoliaSearch"]>(
    "StanfordBasicSiteSetting",
    "suSiteAlgoliaSearch"
  )
  if (appId) console.warn("It is recommended to set environment variables for Algolia credentials.")

  return appId && indexName && apiKey ? [appId, indexName, apiKey] : []
}

export const getHomePagePath = async () => {
  cacheTag("paths:/")
  cacheLife("max")
  const {entity} = await getEntityFromPath("/")
  return entity?.path
}

export const getFilterTerms = async (vocab: FilterVocabs): Promise<Array<TermInterface>> => {
  cacheTag(`taxonomy:${vocab}`)
  cacheLife("max")
  switch (vocab) {
    case FilterVocabs.Courses:
      return (await graphqlClient().CourseFiltersTerms()).termCourseFilters.nodes as unknown as TermInterface[]

    case FilterVocabs.Events:
      return (await graphqlClient().EventFiltersTerms()).termEventFilters.nodes as unknown as TermInterface[]

    case FilterVocabs.Media:
      return (await graphqlClient().MediaContentFiltersTerms()).termMediaContentFilters
        .nodes as unknown as TermInterface[]

    case FilterVocabs.News:
      return (await graphqlClient().NewsSpotlightFiltersTerms()).termStanfordNewsSpotlightFilters
        .nodes as unknown as TermInterface[]

    case FilterVocabs.Opportunities:
      return (await graphqlClient().OpportunityFiltersTerms()).termOpportunityTagFilters
        .nodes as unknown as TermInterface[]

    case FilterVocabs.People:
      return (await graphqlClient().PersonFiltersTerms()).termPersonFilters.nodes as unknown as TermInterface[]

    case FilterVocabs.Publications:
      return (await graphqlClient().PublicationFiltersTerms()).termPublicationFilters
        .nodes as unknown as TermInterface[]
  }
  return []
}

export const getTermFilterGroups = async (vocab: FilterVocabs): Promise<Array<FilterGroup>> => {
  const filterTerms = await getFilterTerms(vocab)
  const filterGroups = filterTerms
    .sort((a, b) => a.weight - b.weight)
    .filter(term => !filterTerms.find(t => t.uuid === term.parent?.uuid))

  const filters: Array<FilterGroup> = []
  filterGroups.map(groupTerm => {
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
