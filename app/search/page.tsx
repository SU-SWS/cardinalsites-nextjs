import {H1} from "@components/elements/headers"
import {getAlgoliaCredential} from "@lib/gql/gql-queries"
import AlgoliaSearch from "@components/algolia/algolia-search"
import SiteSearch from "@components/search/site-search"
import {Suspense} from "react"
import {Metadata} from "next"

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

  const [appId, indexName, apiKey] = await getAlgoliaCredential()

  return (
    <Suspense fallback={<></>}>
      <div className="centered mt-32">
        <div className="mx-auto 3xl:w-10/12">
          <H1 className="mb-44" id="page-title">
            Search
          </H1>

          {appId && indexName && apiKey && (
            <AlgoliaSearch appId={appId} searchIndex={indexName} searchApiKey={apiKey} />
          )}

          {!appId && <SiteSearch search={searchQuery || ""} />}
          <noscript>Please enable javascript to view search results</noscript>
        </div>
      </div>
    </Suspense>
  )
}

export default Page
