import '../src/styles/index.css';
import BackToTop from "@components/elements/back-to-top";
import DrupalWindowSync from "@components/elements/drupal-window-sync";
import Editori11y from "@components/tools/editorially";
import Link from "@components/elements/link";
import PageFooter from "@components/global/page-footer";
import PageHeader from "@components/global/page-header";
import Script from "next/script";
import {GoogleAnalytics} from "@next/third-parties/google";
import {Icon} from "next/dist/lib/metadata/types/metadata-types";
import {StanfordBasicSiteSetting} from "@lib/gql/__generated__/drupal.d";
import {getConfigPage} from "@lib/gql/gql-queries";
import {isDraftMode} from "@lib/drupal/utils";
import {sourceSans3} from "../src/styles/fonts";

const appleIcons: Icon[] = [60, 72, 76, 114, 120, 144, 152, 180].map(size => ({
  url: `https://www-media.stanford.edu/assets/favicon/apple-touch-icon-${size}x${size}.png`,
  sizes: `${size}x${size}`,
}));

const icons: Icon[] = [16, 32, 96, 128, 192, 196].map(size => ({
  url: size === 128 ? `https://www-media.stanford.edu/assets/favicon/favicon-${size}.png` : `https://www-media.stanford.edu/assets/favicon/favicon-${size}x${size}.png`,
  sizes: `${size}x${size}`
}));

/**
 * Metadata that does not change often.
 */
export const metadata = {
  metadataBase: new URL('https://somesite.stanford.edu'),
  title: 'Stanford University',
  openGraph: {
    type: 'website',
    locale: 'en_IE',
    url: 'https://somesite.stanford.edu',
    siteName: '[Stanford University]',
  },
  twitter: {
    card: 'summary_large_image',
  },
  icons: {
    icon: [{url: '/favicon.ico'}, ...icons],
    apple: appleIcons
  }
}

// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
export const revalidate = false;

const RootLayout = async ({children, modal}: { children: React.ReactNode, modal: React.ReactNode }) => {
  const draftMode = isDraftMode();
  const siteSettingsConfig = await getConfigPage<StanfordBasicSiteSetting>('StanfordBasicSiteSetting')
  return (
    <html lang="en" className={sourceSans3.className}>
    {draftMode && <><Editori11y/><DrupalWindowSync/></>}

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

      </main>
      <BackToTop/>
      <PageFooter/>
    </div>
    {modal}
    </body>
    </html>
  )
}
export default RootLayout;