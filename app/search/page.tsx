import {H1} from "@components/elements/headers"
import {getAlgoliaCredential, getConfigPageField} from "@lib/gql/gql-queries"
import AlgoliaSearch from "@components/algolia/algolia-search"
import {Suspense} from "react"
import {Metadata} from "next"
import {notFound} from "next/navigation"
import {StanfordBasicSiteSetting} from "@lib/gql/__generated__/graphql"

// Vercel max execution. See https://vercel.com/docs/functions/configuring-functions/duration
export const maxDuration = 30
export const dynamic = "force-static"

export const metadata: Metadata = {
  title: "Search",
  description: "Search the site",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
  },
}

const Page = async () => {
  const hideSearch =
    (await getConfigPageField<StanfordBasicSiteSetting, StanfordBasicSiteSetting["suHideSiteSearch"]>(
      "StanfordBasicSiteSetting",
      "suHideSiteSearch"
    )) === true
  if (hideSearch) notFound()

  const [appId, indexName, apiKey] = await getAlgoliaCredential()
  if (!appId || !indexName || !apiKey) notFound()

  return (
    <div className="mt-64 centered">
      <div className="mx-auto 3xl:w-10/12">
        <H1 className="mb-88" id="page-title">
          Search
        </H1>

        <div>
          {appId && indexName && apiKey && (
            <Suspense>
              <AlgoliaSearch appId={appId} searchIndex={indexName} searchApiKey={apiKey} />
            </Suspense>
          )}
          <noscript>Please enable javascript to view search results</noscript>
        </div>
      </div>
    </div>
  )
}

export default Page
