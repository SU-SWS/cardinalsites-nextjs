import {stringify} from "qs"
import {AccessToken} from "next-drupal";
import {getAccessToken} from "@lib/drupal/get-access-token";
import {draftMode} from "next/headers";

/*
 * Draft mode works when in normal builds. Use environment variable during development.
 */
export const isDraftMode = (): boolean => {
  return process.env.NODE_ENV === 'development' || draftMode().isEnabled;
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

export const buildHeaders = async ({accessToken, headers = {}, draftMode = false}: {
  accessToken?: AccessToken
  headers?: HeadersInit
  draftMode?: boolean
} = {}): Promise<Headers> => {
  if (process.env.REQUEST_HEADERS) headers = {...headers, ...JSON.parse(process.env.REQUEST_HEADERS)};

  const requestHeaders = new Headers(headers);

  const token = accessToken || (await getAccessToken(draftMode))
  if (token) requestHeaders.set('Authorization', `Bearer ${token.access_token}`)

  return requestHeaders
}
