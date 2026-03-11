import {GraphQLClient} from "graphql-request"

/**
 * Creates a configured GraphQL client for communicating with the Drupal backend.
 *
 * @param requestConfig - Optional fetch `RequestInit` options (excluding `method`) to pass to the client.
 * @param isPreviewMode - When `true`, admin credentials are preferred so draft/unpublished content is accessible.
 * @returns A `GraphQLClient` instance pointed at the Drupal GraphQL endpoint.
 */
export const graphqlClient = (requestConfig: Omit<RequestInit, "method"> = {}, isPreviewMode?: boolean) => {
  requestConfig.headers = buildHeaders(requestConfig.headers as HeadersInit, isPreviewMode)

  return new GraphQLClient(process.env.NEXT_PUBLIC_DRUPAL_BASE_URL + "/graphql", {
    ...requestConfig,
    // Use fetch function so Next.js will be able to cache it normally.
    fetch: async (input: URL | RequestInfo, init?: RequestInit) => fetch(input, init),
  })
}

/**
 * Builds the HTTP headers required for authenticated requests to the Drupal backend.
 *
 * Any headers supplied via the `DRUPAL_REQUEST_HEADERS` environment variable (JSON object) are
 * merged in first, allowing arbitrary header overrides at the infrastructure level. A Basic Auth
 * `Authorization` header is then appended when credentials are available.
 *
 * @param headers - Base headers to merge into the resulting `Headers` object.
 * @param isPreviewMode - When `true`, admin credentials (`DRUPAL_BASIC_AUTH_ADMIN`) are preferred
 *   over the standard credentials (`DRUPAL_BASIC_AUTH`) so that preview requests can access
 *   restricted/unpublished content.
 * @returns A `Headers` instance ready to attach to outgoing requests.
 */
export const buildHeaders = (headers?: HeadersInit, isPreviewMode?: boolean): Headers => {
  const requestHeaders = new Headers(headers)
  // If viewing while in preview mode, use the admin credentials if they are available. Fall back to the basic credentials.
  const authCreds = (
    isPreviewMode ? process.env.DRUPAL_BASIC_AUTH_ADMIN || process.env.DRUPAL_BASIC_AUTH : process.env.DRUPAL_BASIC_AUTH
  ) as string

  if (process.env.DRUPAL_REQUEST_HEADERS) {
    // Parse and apply any extra headers defined at the environment/infrastructure level.
    const envRequestHeaders: Record<string, string> = JSON.parse(process.env.DRUPAL_REQUEST_HEADERS)
    Object.keys(envRequestHeaders).map(key => {
      requestHeaders.set(key, envRequestHeaders[key])
    })
  }

  if (authCreds) requestHeaders.set("Authorization", "Basic " + Buffer.from(authCreds).toString("base64"))
  return requestHeaders
}
