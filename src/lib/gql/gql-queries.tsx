import {AllNodesQuery, AllNodesQueryVariables, ConfigPagesQuery, ConfigPagesUnion, MenuAvailable, MenuItem, NodeUnion, Redirect, RedirectsQuery, RedirectsQueryVariables, RouteQuery, RouteRedirect, TermUnion} from "@lib/gql/__generated__/drupal.d";
import {cache} from "react";
import {buildHeaders} from "@lib/drupal/utils";
import {cache as nodeCache} from "@lib/drupal/get-cache";
import {graphqlClient} from "@lib/gql/gql-client";

export const getEntityFromPath = cache(async <T extends NodeUnion | TermUnion, >(path: string, previewMode: boolean = false): Promise<{
  entity?: T,
  redirect?: RouteRedirect
  error?: string
}> => {
  "use server";

  const headers = await buildHeaders({previewMode})
  let entity: T | undefined;
  let query: RouteQuery;

  try {
    query = await graphqlClient({headers, next: {tags: [`paths:${path}`]}}).Route({path});
  } catch (e) {
    console.warn(e instanceof Error ? e.message : "An error occurred");
    return {entity: undefined, redirect: undefined, error: e instanceof Error ? e.message : "An error occurred"}
  }

  if (query.route?.__typename === "RouteRedirect") return {redirect: query.route, entity: undefined};
  entity = (query.route?.__typename === "RouteInternal" && query.route.entity) ? query.route.entity as T : undefined
  return {entity, redirect: undefined, error: undefined};
})

export const getConfigPage = async <T extends ConfigPagesUnion, >(configPageType: ConfigPagesUnion["__typename"]): Promise<T | undefined> => {
  "use server";

  let query: ConfigPagesQuery;
  try {
    query = await getConfigPagesData();
  } catch (e) {
    console.warn("Unable to fetch config pages");
    return;
  }

  const queryKeys = Object.keys(query) as (keyof ConfigPagesQuery)[]
  for (let i = 0; i < queryKeys.length; i++) {
    const queryKey = queryKeys[i]
    if (queryKey !== "__typename" && query[queryKey]?.nodes[0]?.__typename === configPageType) {
      return query[queryKey].nodes[0] as T
    }
  }
}

const getConfigPagesData = cache(async (): Promise<ConfigPagesQuery> => {
  "use server";

  // Config page data doesn"t change if a user is in "Draft" mode or not, so the data can be cached for both situations.
  const cachedData = nodeCache.get<ConfigPagesQuery>("config-pages")
  if (cachedData) return cachedData;

  const headers = await buildHeaders()
  const query = await graphqlClient({headers, next: {tags: ["config-pages"]}}).ConfigPages();

  nodeCache.set("config-pages", query);
  return query;
})

export const getMenu = cache(async (name?: MenuAvailable, previewMode?: boolean): Promise<MenuItem[]> => {
  "use server";

  const headers = await buildHeaders({previewMode});
  const menu = await graphqlClient({headers, next: {tags: ["menus", `menu:${name || "main"}`]}}).Menu({name});
  const menuItems = (menu.menu?.items || []) as MenuItem[];

  const filterInaccessible = (items: MenuItem[]): MenuItem[] => {
    items = items.filter(item => item.title !== "Inaccessible");
    items.map(item => item.children = filterInaccessible(item.children));
    return items;
  }
  return filterInaccessible(menuItems)
})

export const getAllNodes = cache(async () => {
  "use server";

  const nodes: NodeUnion[] = [];
  let fetchMore = true;
  let nodeQuery: AllNodesQuery;
  let queryKeys: (keyof AllNodesQuery)[] = [];
  const cursors: Omit<AllNodesQueryVariables, "first"> = {};

  while (fetchMore) {
    nodeQuery = await graphqlClient({next: {tags: ["paths"]}}).AllNodes({first: 1000, ...cursors});
    queryKeys = Object.keys(nodeQuery) as (keyof AllNodesQuery)[]
    fetchMore = false;

    queryKeys.map(queryKey => {
      if (queryKey === "__typename") return;

      nodeQuery[queryKey]?.nodes.map(node => nodes.push(node as NodeUnion));

      if (nodeQuery[queryKey].pageInfo.endCursor) cursors[queryKey] = nodeQuery[queryKey].pageInfo.endCursor;
      if (nodeQuery[queryKey].pageInfo.hasNextPage) fetchMore = true
    })
  }

  return nodes;
})

export const getAllRedirects = async (): Promise<Redirect[]> => {
  "use server";

  let fetchMore = true;
  let queryResponse: RedirectsQuery;
  let variables: RedirectsQueryVariables = {first: 1000};
  let redirects: Redirect[] = [];
  while (fetchMore) {
    queryResponse = await graphqlClient({next: {tags: ["paths"]}}).Redirects(variables)
    redirects = [...redirects, ...queryResponse.redirects.redirects as Redirect[]]
    fetchMore = queryResponse.redirects.redirects.length === 1000;
    variables.after = queryResponse.redirects.pageInfo.endCursor;
  }
  return redirects;
}