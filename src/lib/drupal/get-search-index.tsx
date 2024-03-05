import {AccessToken, JsonApiResource, JsonApiWithLocaleOptions} from "next-drupal";
import {buildHeaders, buildUrl} from "@lib/drupal/utils";
import {deserialize} from "@lib/drupal/deserialize";

export async function getSearchIndex<T = JsonApiResource[]>(
  name: string,
  options?: { deserialize?: boolean,accessToken?: AccessToken } & JsonApiWithLocaleOptions
): Promise<T> {

  options = {deserialize: true, ...options}

  const url = buildUrl(`/jsonapi/index/${name}`, options.params)

  const response = await fetch(url.toString(), {headers: await buildHeaders(options),})

  if (!response.ok) throw new Error(response.statusText)

  const json = await response.json()

  return options.deserialize ? deserialize(json) : json
}
