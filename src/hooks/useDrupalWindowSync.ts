"use client"

import {usePathname} from "next/navigation"
import {useIsClient} from "usehooks-ts"
import {useEffect} from "react"

const useDrupalWindowSync = () => {
  const pathname = usePathname()
  const isClient = useIsClient()

  useEffect(() => {
    fetch("/api/draft/disable").catch(_e => console.warn("Disabling preview mode failed"))
  }, [])

  if (!isClient) return

  if (
    pathname &&
    !pathname?.startsWith("/gallery/") &&
    !pathname?.startsWith("/preview") &&
    window &&
    window.top !== window.self
  ) {
    window.parent.postMessage(
      {
        type: "NEXT_DRUPAL_ROUTE_SYNC",
        path: pathname,
      },
      process.env.NEXT_PUBLIC_DRUPAL_BASE_URL as string
    )
  }
  return null
}

export default useDrupalWindowSync
