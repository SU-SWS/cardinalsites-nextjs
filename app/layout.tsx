import '../src/styles/index.css';
import {sourceSans3} from "../src/styles/fonts";
import PageHeader from "@components/global/page-header";
import PageFooter from "@components/global/page-footer";
import Editori11y from "@components/tools/editorially";
import Script from "next/script";
import {isDraftMode} from "@lib/drupal/utils";
import BackToTop from "@components/elements/back-to-top";
import Link from "@components/elements/link";
import {getConfigPage} from "@lib/gql/gql-queries";
import {StanfordBasicSiteSetting} from "@lib/gql/__generated__/drupal.d";
import {GoogleAnalytics} from "@next/third-parties/google";

export const metadata = {
  // Update the metadataBase to the production domain.
  // metadataBase: new URL('https://somesite.stanford.edu'),
  title: 'Stanford University'
}

// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
export const revalidate = false;
export const dynamic = 'force-static';

const RootLayout = async ({children, modal}: { children: React.ReactNode, modal: React.ReactNode }) => {
  const draftMode = isDraftMode();
  const siteSettingsConfig = await getConfigPage<StanfordBasicSiteSetting>('StanfordBasicSiteSetting')
  return (
    <html lang="en" className={sourceSans3.className}>
    {draftMode && <Editori11y/>}

    {/* Add Google Analytics and SiteImprove when not in draft mode. */}
    {(!draftMode && siteSettingsConfig?.suGoogleAnalytics) &&
      <>
        <Script async src="//siteimproveanalytics.com/js/siteanalyze_80352.js"/>
        <GoogleAnalytics gaId={siteSettingsConfig?.suGoogleAnalytics}/>
      </>
    }
    <body>
    <nav aria-label="Skip Links">
      <a href="#main-content" className="skiplink">Skip to main content</a>
    </nav>

    {/* Automatically exit "Draft" mode upon the page loading. This prevents unwanted uncached data fetching. */}
    {draftMode &&
      <Link href="/api/draft/disable" tabIndex={-1} className="sr-only">Disable Draft Mode</Link>
    }

    <div className="flex flex-col min-h-screen">
      <PageHeader/>
      <main id="main-content" className="flex-grow mb-32">
        {children}
        {modal}
      </main>
      <BackToTop/>
      <PageFooter/>
    </div>
    </body>
    </html>
  )
}
export default RootLayout;