import {Source_Sans_3} from "next/font/google"
import localFont from "next/font/local"

export const sourceSans3 = Source_Sans_3({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  adjustFontFallback: false,
})

export const stanford = localFont({
  src: "stanford.woff2",
  weight: "300",
  variable: "--font-stanford",
})
