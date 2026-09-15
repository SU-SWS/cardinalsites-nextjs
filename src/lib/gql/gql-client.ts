/** A single error entry from Drupal's GraphQL endpoint. Drupal adds `debugMessage` to the spec fields. */
export type DrupalGraphqlError = {
  message: string
  debugMessage?: string
  path?: (string | number)[]
  locations?: {line: number; column: number}[]
  extensions?: Record<string, unknown>
}

/** Parsed body of a GraphQL response. */
type GraphqlResponseBody<TResult> = {data?: TResult | null; errors?: DrupalGraphqlError[]}

/**
 * Thrown when a GraphQL request fails, either at the transport level (non-2xx) or because the
 * response carried a GraphQL `errors` array.
 */
export class ClientError extends Error {
  readonly response: {status: number; errors?: DrupalGraphqlError[]}

  constructor(message: string, response: {status: number; errors?: DrupalGraphqlError[]}) {
    super(message)
    this.name = "ClientError"
    this.response = response
  }
}

/**
 * Creates a configured GraphQL client for communicating with the Drupal backend.
 *
 * Requests go through the global `fetch` so Next.js can cache them normally.
 *
 * @param requestConfig - Optional fetch `RequestInit` options (`method` and `body` are set by the
 *   client) applied to every request, e.g. `cache` or `signal`.
 * @param isPreviewMode - When `true`, admin credentials are preferred so draft/unpublished content is accessible.
 * @returns A client exposing `request()` for executing generated operations.
 */
export const graphqlClient = (requestConfig: Omit<RequestInit, "method" | "body"> = {}, isPreviewMode?: boolean) => {
  const baseHeaders = new Headers(requestConfig.headers)
  // Set before buildHeaders so DRUPAL_REQUEST_HEADERS can still override it.
  if (!baseHeaders.has("Content-Type")) baseHeaders.set("Content-Type", "application/json")
  const headers = buildHeaders(baseHeaders, isPreviewMode)
  const endpoint = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL + "/graphql"

  return {
    /**
     * Executes a generated operation against the Drupal endpoint.
     *
     * @param document - A generated `TypedDocumentString` (or any value that serializes to a query).
     * @param variables - Variables for the operation.
     * @returns The `data` payload of the response.
     * @throws {ClientError} When the request fails or the response contains GraphQL errors.
     */
    async request<TResult = unknown, TVariables = Record<string, unknown>>(
      document: {toString(): string},
      variables?: TVariables
    ): Promise<TResult> {
      const response = await fetch(endpoint, {
        ...requestConfig,
        method: "POST",
        headers,
        body: JSON.stringify({query: document.toString(), variables}),
      })

      let body: GraphqlResponseBody<TResult> | undefined
      try {
        body = (await response.json()) as GraphqlResponseBody<TResult>
      } catch {
        // Non-JSON body, such as a proxy or WAF error page. Fall through to the status-based error.
      }

      if (!response.ok || body?.errors?.length || !body?.data) {
        const firstError = body?.errors?.[0]
        throw new ClientError(
          firstError?.debugMessage ||
            firstError?.message ||
            `GraphQL request failed: ${response.status} ${response.statusText}`,
          {status: response.status, errors: body?.errors}
        )
      }

      return body.data
    },
  }
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
