import "../src/styles/index.css"
import {Icon} from "next/dist/lib/metadata/types/metadata-types"
import {sourceSans3, stanford} from "../src/styles/typography/fonts"
import DrupalWindowSync from "@components/elements/drupal-window-sync"
import UserAnalytics from "@components/elements/user-analytics"
import {twJoin} from "tailwind-merge"
import GlobalPage from "@components/layouts/global-page"

const appleIcons: Icon[] = [60, 72, 76, 114, 120, 144, 152, 180].map(size => ({
  url: `https://www-media.stanford.edu/assets/favicon/apple-touch-icon-${size}x${size}.png`,
  sizes: `${size}x${size}`,
}))

const icons: Icon[] = [16, 32, 96, 128, 192, 196].map(size => ({
  url:
    size === 128
      ? `https://www-media.stanford.edu/assets/favicon/favicon-${size}.png`
      : `https://www-media.stanford.edu/assets/favicon/favicon-${size}x${size}.png`,
  sizes: `${size}x${size}`,
}))

/**
 * Metadata that does not change often.
 */
export const metadata = {
  metadataBase: new URL("https://somesite.stanford.edu"),
  title: "Stanford University",
  openGraph: {
    type: "website",
    locale: "en_IE",
    url: "https://somesite.stanford.edu",
    siteName: "[Stanford University]",
  },
  twitter: {
    card: "summary_large_image",
  },
  icons: {
    icon: [{url: "/favicon.ico"}, ...icons],
    apple: appleIcons,
  },
}

// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
export const revalidate = false

const RootLayout = ({children, modal}: {children: React.ReactNode; modal: React.ReactNode}) => {
  return (
    <html lang="en" className={twJoin(sourceSans3.className, stanford.variable)}>
      <UserAnalytics />
      <DrupalWindowSync />
      <body>
        <nav aria-label="Skip Links">
          <a href="#main-content" className="skiplink">
            Skip to main content
          </a>
        </nav>
        <GlobalPage>{children}</GlobalPage>
        {modal}
      </body>
    </html>
  )
}
export default RootLayout
