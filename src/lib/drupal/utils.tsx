import {stringify} from "qs"
import {AccessToken} from "next-drupal";
import {getAccessToken} from "@lib/drupal/get-access-token";
import {cookies} from "next/headers";

/*
 * Draft mode works when in normal builds. Use environment variable during development.
 */
export const isPreviewMode = (): boolean => {
  return process.env.NODE_ENV === 'development' || cookies()?.get('preview')?.value === process.env.DRUPAL_PREVIEW_SECRET;
}

export const buildUrl = (
  path: string,
  params?: string | Record<string, string> | URLSearchParams
): URL => {
  const url = new URL(path.charAt(0) === "/" ? `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}${path}` : path)

  // Use instead URLSearchParams for nested params.
  if (params) url.search = stringify(params)
  return url
}

export const buildHeaders = async ({accessToken, headers = {}, previewMode = false}: {
  accessToken?: AccessToken
  headers?: HeadersInit
  previewMode?: boolean
} = {}): Promise<Headers> => {
  if (process.env.REQUEST_HEADERS) headers = {...headers, ...JSON.parse(process.env.REQUEST_HEADERS)};

  const requestHeaders = new Headers(headers);

  const token = accessToken || (await getAccessToken(previewMode))
  if (token) requestHeaders.set('Authorization', `Bearer ${token.access_token}`)

  return requestHeaders
}

export type PageProps = {
  params: { slug: string | string[] }
  searchParams?: Record<string, string | string[] | undefined>
}

export const getPathFromContext = (context: PageProps, prefix = ""): string => {
  let {slug} = context.params

  slug = Array.isArray(slug) ? slug.map((s) => encodeURIComponent(s)).join("/") : slug
  slug = slug.replace(/^\//, '');
  return prefix ? `${prefix}/${slug}` : `/${slug}`
}