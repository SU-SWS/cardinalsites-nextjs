import {H1} from "@components/elements/headers";
import {getConfigPage} from "@lib/gql/gql-queries";
import {StanfordBasicSiteSetting} from "@lib/gql/__generated__/drupal.d";
import {IndexUiState} from "instantsearch.js/es/types/ui-state";
import AlgoliaSearch from "@components/algolia/algolia-search";

// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
export const revalidate = false;

export const metadata = {
  title: "Search",
  description: "Search the site",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
  }
}
const Page = async ({searchParams}: { searchParams?: { [_key: string]: string } }) => {

  const siteSettingsConfig = await getConfigPage<StanfordBasicSiteSetting>("StanfordBasicSiteSetting")

  const initialState: IndexUiState = {refinementList: {}}
  if (searchParams?.q) initialState.query = searchParams.q as string

  return (
    <div className="centered mt-32">
      <div className="3xl:w-10/12 mx-auto">
        <H1 className="mb-44" id="page-title">Search</H1>

        {(siteSettingsConfig?.suSiteAlgoliaId && siteSettingsConfig?.suSiteAlgoliaIndex && siteSettingsConfig?.suSiteAlgoliaSearch) &&
          <>
            <AlgoliaSearch
              appId={siteSettingsConfig.suSiteAlgoliaId}
              searchIndex={siteSettingsConfig.suSiteAlgoliaIndex}
              searchApiKey={siteSettingsConfig.suSiteAlgoliaSearch}
              initialUiState={initialState}
            />
            <noscript>Please enable javascript to view search results</noscript>
          </>
        }
      </div>
    </div>
  )
}

export default Page;