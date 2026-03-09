import {GraphQLClient} from "graphql-request"

export const graphqlClient = (
  requestConfig: Omit<RequestInit, "method"> = {},
  isPreviewMode?: boolean
): GraphQLClient => {
  const headers = buildHeaders(requestConfig.headers as HeadersInit, isPreviewMode)
  return new GraphQLClient(process.env.NEXT_PUBLIC_DRUPAL_BASE_URL + "/graphql", {
    ...requestConfig,
    headers,
    // Use fetch function so Next.js will be able to cache it normally.
    fetch: async (input: URL | RequestInfo, init?: RequestInit) => fetch(input, init),
  })
}

export const buildHeaders = (headers?: HeadersInit, isPreviewMode?: boolean): Headers => {
  const requestHeaders = new Headers(headers)
  // If viewing while in preview mode, use the admin credentials if they are available. Fall back to the basic credentials.
  const authCreds = (
    isPreviewMode ? process.env.DRUPAL_BASIC_AUTH_ADMIN || process.env.DRUPAL_BASIC_AUTH : process.env.DRUPAL_BASIC_AUTH
  ) as string

  if (process.env.DRUPAL_REQUEST_HEADERS) {
    const envRequestHeaders: Record<string, string> = JSON.parse(process.env.DRUPAL_REQUEST_HEADERS)
    Object.keys(envRequestHeaders).map(key => {
      requestHeaders.set(key, envRequestHeaders[key])
    })
  }

  if (authCreds) requestHeaders.set("Authorization", "Basic " + Buffer.from(authCreds).toString("base64"))
  return requestHeaders
}
