import {AllNodesQuery, AllNodesQueryVariables, ConfigPagesQuery, ConfigPagesUnion, MenuAvailable, MenuItem, NodeUnion, RouteQuery, RouteRedirect, TermUnion} from "@lib/gql/__generated__/drupal.d"
import {cache} from "react"
import {graphqlClient} from "@lib/gql/gql-client"

export const getEntityFromPath = async <T extends NodeUnion | TermUnion>(
  path: string,
  previewMode: boolean = false
): Promise<{
  entity?: T
  redirect?: RouteRedirect
  error?: Error
}> => {
  "use server"

  let entity: T | undefined
  let query: RouteQuery

  try {
    query = await graphqlClient({next: {tags: [`paths:${path}`]}}, previewMode).Route({path})
  } catch (e) {
    return {entity: undefined, redirect: undefined, error: e as Error}
  }

  if (query.route?.__typename === "RouteRedirect") return {redirect: query.route, entity: undefined}
  entity = query.route?.__typename === "RouteInternal" && query.route.entity ? (query.route.entity as T) : undefined
  return {entity, redirect: undefined, error: undefined}
}

export const getConfigPage = async <T extends ConfigPagesUnion>(configPageType: ConfigPagesUnion["__typename"]): Promise<T | undefined> => {
  "use server"

  let query: ConfigPagesQuery
  try {
    query = await graphqlClient({next: {tags: ["config-pages"]}}).ConfigPages()
  } catch (e) {
    console.warn("Unable to fetch config pages")
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

export const getMenu = cache(async (name?: MenuAvailable): Promise<MenuItem[]> => {
  "use server"

  const menu = await graphqlClient({next: {tags: ["menus", `menu:${name || "main"}`]}}).Menu({name})
  const menuItems = (menu.menu?.items || []) as MenuItem[]

  const filterInaccessible = (items: MenuItem[]): MenuItem[] => {
    items = items.filter(item => item.title !== "Inaccessible")
    items.map(item => (item.children = filterInaccessible(item.children)))
    return items
  }
  return filterInaccessible(menuItems)
})

export const getAllNodes = cache(async () => {
  "use server"

  const nodes: NodeUnion[] = []
  let fetchMore = true
  let nodeQuery: AllNodesQuery
  let queryKeys: (keyof AllNodesQuery)[] = []
  const cursors: Omit<AllNodesQueryVariables, "first"> = {}

  while (fetchMore) {
    nodeQuery = await graphqlClient({next: {tags: ["paths"]}}).AllNodes({first: 1000, ...cursors})
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
})
