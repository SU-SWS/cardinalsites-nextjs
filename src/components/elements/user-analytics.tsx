import {getConfigPageField} from "@lib/gql/gql-queries"
import {StanfordBasicSiteSetting} from "@lib/gql/__generated__/drupal.d"
import Script from "next/script"
import {GoogleAnalytics, GoogleTagManager} from "@next/third-parties/google"

const UserAnalytics = async () => {
  if (process.env.NODE_ENV === "development") return

  const ga4 = await getConfigPageField<StanfordBasicSiteSetting, StanfordBasicSiteSetting["suGoogleAnalytics"]>(
    "StanfordBasicSiteSetting",
    "suGoogleAnalytics"
  )

  const gtm = process.env.NEXT_PUBLIC_GTM
  if (!ga4 && !gtm) return

  return (
    <>
      <Script async src="https://siteimproveanalytics.com/js/siteanalyze_634745.js" />
      {ga4 && ga4.split(",").map(ga4ID => <GoogleAnalytics key={ga4ID} gaId={ga4ID.trim()} />)}
      {gtm && <GoogleTagManager gtmId={gtm} />}
    </>
  )
}
export default UserAnalytics
