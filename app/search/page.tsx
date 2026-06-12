import {H1} from "@components/elements/headers"
import {getAlgoliaCredential, getConfigPageField} from "@lib/gql/gql-queries"
import AlgoliaSearch from "@components/algolia/algolia-search"
import SiteSearch from "@components/search/site-search"
import {Suspense} from "react"
import {Metadata} from "next"
import {StanfordBasicSiteSetting} from "@lib/gql/__generated__/graphql"
import {notFound} from "next/navigation"

// Vercel max execution. See https://vercel.com/docs/functions/configuring-functions/duration
export const maxDuration = 30

export const metadata: Metadata = {
  title: "Search",
  description: "Search the site",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
  },
}
const Page = async (props: {searchParams?: Promise<Record<string, string>>}) => {
  const searchQuery = props.searchParams?.then(sp => sp.q)
  const hideSearch =
    (await getConfigPageField<StanfordBasicSiteSetting, StanfordBasicSiteSetting["suHideSiteSearch"]>(
      "StanfordBasicSiteSetting",
      "suHideSiteSearch"
    )) === true
  if (hideSearch) notFound()
  const [appId, indexName, apiKey] = await getAlgoliaCredential()

  return (
    <div className="centered mt-32">
      <div className="mx-auto 3xl:w-10/12">
        <H1 className="mb-44" id="page-title">
          Search
        </H1>

        {appId && indexName && apiKey && (
          <Suspense>
            <AlgoliaSearch appId={appId} searchIndex={indexName} searchApiKey={apiKey} />
          </Suspense>
        )}

        {!appId && (
          <Suspense>
            <SiteSearch search={searchQuery || ""} />
          </Suspense>
        )}
        <noscript>Please enable javascript to view search results</noscript>
      </div>
    </div>
  )
}

export default Page
