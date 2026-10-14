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

/** Drupal is given this long to answer before the request is abandoned, so a hung backend can't stall a render. */
const REQUEST_TIMEOUT_MS = 15000

/** Base class for every failed GraphQL request. Check for a subclass to tell the causes apart. */
export class ClientError extends Error {
  // Names are literal strings: production builds minify class names, which would turn logs into "f: ...".
  name = "ClientError"
  /**
   * Stable code for the failure cause. Next keeps a digest an error already has instead of hashing it, and the
   * digest is the only part of a server error that reaches the error page in production. So the cause shows in
   * the 500 response body (see app/error.tsx), e.g. `curl -s /path | grep DRUPAL_`.
   */
  digest = "DRUPAL_ERROR"
}

/** Drupal could not be reached: connection refused, DNS failure, or no answer within the timeout. */
export class NetworkError extends ClientError {
  name = "NetworkError"

  constructor(
    message: string,
    readonly timedOut: boolean,
    options?: ErrorOptions
  ) {
    super(message, options)
    this.digest = timedOut ? "DRUPAL_TIMEOUT" : "DRUPAL_UNREACHABLE"
  }
}

/** Drupal answered with an error status or a non-JSON body, such as a proxy or WAF error page. */
export class HttpError extends ClientError {
  name = "HttpError"

  constructor(
    message: string,
    readonly status: number,
    readonly errors?: DrupalGraphqlError[]
  ) {
    super(message)
    this.digest = `DRUPAL_HTTP_${status}`
  }
}

/** Drupal answered, but the response carried GraphQL errors or no data. */
export class GraphqlError extends ClientError {
  name = "GraphqlError"

  constructor(
    message: string,
    readonly errors: DrupalGraphqlError[] = []
  ) {
    super(message)
    this.digest = "DRUPAL_GRAPHQL"
  }
}

/**
 * A readable summary of a failed request, for logs. Drupal's `debugMessage` is preferred and repeated
 * messages are deduplicated.
 */
export const describeError = (error: unknown): string => {
  const errors = error instanceof GraphqlError || error instanceof HttpError ? error.errors : undefined
  const messages = errors?.map(e => e.debugMessage || e.message).filter(Boolean)
  if (messages?.length) return [...new Set(messages)].join(" ")
  return error instanceof Error ? error.message : String(error)
}

/**
 * Creates a configured GraphQL client for communicating with the Drupal backend.
 *
 * Requests go through the global `fetch`. Caching is handled by the `"use cache"` functions that call
 * the client (see gql-queries.ts and gql-views.ts), not by the fetch cache.
 *
 * @param requestConfig - Optional fetch `RequestInit` options (`method` and `body` are set by the
 *   client) applied to every request, e.g. `signal`.
 * @param isPreviewMode - When `true`, admin credentials are used so draft/unpublished content is accessible.
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
     * @throws {NetworkError} When Drupal can't be reached or doesn't answer in time.
     * @throws {HttpError} When Drupal answers with an error status or a non-JSON body.
     * @throws {GraphqlError} When the response carries GraphQL errors or no data.
     */
    async request<TResult = unknown, TVariables = Record<string, unknown>>(
      document: {toString(): string},
      variables?: TVariables
    ): Promise<TResult> {
      const timeout = AbortSignal.timeout(REQUEST_TIMEOUT_MS)
      let response: Response
      try {
        response = await fetch(endpoint, {
          ...requestConfig,
          method: "POST",
          headers,
          body: JSON.stringify({query: document.toString(), variables}),
          signal: requestConfig.signal ? AbortSignal.any([requestConfig.signal, timeout]) : timeout,
        })
      } catch (e) {
        const timedOut = timeout.aborted
        throw new NetworkError(
          timedOut
            ? `Drupal did not respond within ${REQUEST_TIMEOUT_MS / 1000}s`
            : `Unable to reach Drupal: ${e instanceof Error ? e.message : e}`,
          timedOut,
          {cause: e}
        )
      }

      let body: GraphqlResponseBody<TResult> | undefined
      try {
        body = (await response.json()) as GraphqlResponseBody<TResult>
      } catch {
        // Non-JSON body, such as a proxy or WAF error page. Reported below by status.
      }

      if (!response.ok || !body)
        throw new HttpError(
          `GraphQL request failed: HTTP ${response.status}${body ? "" : " with a non-JSON response"}`,
          response.status,
          body?.errors
        )

      if (body.errors?.length || !body.data)
        throw new GraphqlError(body.errors?.length ? "GraphQL errors" : "GraphQL response had no data", body.errors)

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
    try {
      // Parse and apply any extra headers defined at the environment/infrastructure level.
      const envRequestHeaders: Record<string, string> = JSON.parse(process.env.DRUPAL_REQUEST_HEADERS)
      Object.entries(envRequestHeaders).forEach(([name, value]) => requestHeaders.set(name, value))
    } catch (_e) {
      console.warn("DRUPAL_REQUEST_HEADERS is not valid JSON, skipping.")
    }
  }

  if (authCreds) requestHeaders.set("Authorization", "Basic " + Buffer.from(authCreds).toString("base64"))
  return requestHeaders
}
