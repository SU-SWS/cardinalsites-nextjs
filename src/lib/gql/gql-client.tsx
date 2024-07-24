import {GraphQLClient} from "graphql-request"
import {getSdk} from "@lib/gql/__generated__/queries"

export const graphqlClient = (requestConfig: Omit<RequestInit, "method"> = {}, isPreviewMode?: boolean) => {
  requestConfig.headers = buildHeaders(requestConfig.headers as HeadersInit, isPreviewMode)

  const client = new GraphQLClient(process.env.NEXT_PUBLIC_DRUPAL_BASE_URL + "/graphql", {
    ...requestConfig,
    next: requestConfig.cache ? {...requestConfig.next} : {revalidate: 60 * 60 * 24 * 365, ...requestConfig.next},
    // Use fetch function so Next.js will be able to cache it normally.
    fetch: async (input: URL | RequestInfo, init?: RequestInit) => fetch(input, init),
  })
  return getSdk(client)
}

export const buildHeaders = (headers?: HeadersInit, isPreviewMode?: boolean): Headers => {
  const requestHeaders = new Headers(headers)
  // If viewing while in preview mode, use the admin credentials if they are available. Fall back to the basic credentials.
  const authCreds = (
    isPreviewMode ? process.env.DRUPAL_BASIC_AUTH_ADMIN || process.env.DRUPAL_BASIC_AUTH : process.env.DRUPAL_BASIC_AUTH
  ) as string

  requestHeaders.set("Authorization", "Basic " + Buffer.from(authCreds).toString("base64"))
  return requestHeaders
}
