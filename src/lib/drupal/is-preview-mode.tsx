import {cookies} from "next/headers"
import type {ReadonlyRequestCookies} from "next/dist/server/web/spec-extension/adapters/request-cookies"

/*
 * Draft mode works when in normal builds. Use environment variable during development.
 */
export const isPreviewMode = (): boolean => {
  return (
    process.env.NODE_ENV === "development" ||
    (cookies() as unknown as ReadonlyRequestCookies)?.get("preview")?.value === process.env.DRUPAL_PREVIEW_SECRET
  )
}
