import type {RequestConfig} from "graphql-request/src/types";
import {GraphQLClient} from "graphql-request";
import {getSdk} from "@lib/gql/__generated__/queries";

export const graphqlClient = (requestConfig: RequestConfig = {}) => {
  const client = new GraphQLClient(
    process.env.NEXT_PUBLIC_DRUPAL_BASE_URL + '/graphql',
    {
      ...requestConfig,
      // Use fetch function so Next.js will be able to cache it normally.
      fetch: async (input: URL | RequestInfo, init?: RequestInit) => fetch(input, init),
    }
  )
  return getSdk(client);
}
