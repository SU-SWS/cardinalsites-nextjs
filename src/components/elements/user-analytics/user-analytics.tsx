import Script from "next/script"
import {GoogleAnalytics, GoogleTagManager} from "@next/third-parties/google"
import {getConfigPageField} from "@lib/gql/gql-queries"
import {StanfordBasicSiteSetting} from "@lib/gql/__generated__/graphql"

const UserAnalytics = async () => {
  if (process.env.VERCEL_ENV !== "production") return

  const ga4 = await getConfigPageField<StanfordBasicSiteSetting, StanfordBasicSiteSetting["suGoogleAnalytics"]>(
    "StanfordBasicSiteSetting",
    "suGoogleAnalytics"
  )

  const gtm = process.env.NEXT_PUBLIC_GTM
  if (!ga4 && !gtm) return

  const ga4Ids = (ga4 || "")
    .split(",")
    .map(ga4ID => ga4ID.trim())
    .filter(Boolean)

  return (
    <>
      <Script async src="https://siteimproveanalytics.com/js/siteanalyze_6343745.js" />
      {ga4Ids.map(ga4ID => (
        <GoogleAnalytics key={ga4ID} gaId={ga4ID} />
      ))}
      {gtm && <GoogleTagManager gtmId={gtm} />}
    </>
  )
}
export default UserAnalytics
