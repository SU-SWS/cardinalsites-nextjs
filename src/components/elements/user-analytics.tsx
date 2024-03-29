import {getConfigPage} from "@lib/gql/gql-queries";
import {StanfordBasicSiteSetting} from "@lib/gql/__generated__/drupal";
import Script from "next/script";
import {GoogleAnalytics} from "@next/third-parties/google";
import {isPreviewMode} from "@lib/drupal/utils";

const UserAnalytics = async () => {
  if (isPreviewMode()) return;
  const siteSettingsConfig = await getConfigPage<StanfordBasicSiteSetting>('StanfordBasicSiteSetting')
  if (!siteSettingsConfig?.suGoogleAnalytics) return;
  return (
    <>
      <Script async src="//siteimproveanalytics.com/js/siteanalyze_80352.js"/>
      <GoogleAnalytics gaId={siteSettingsConfig?.suGoogleAnalytics}/>
    </>
  )
}
export default UserAnalytics;