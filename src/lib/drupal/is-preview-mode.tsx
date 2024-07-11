import {cookies} from "next/headers"

/*
 * Draft mode works when in normal builds. Use environment variable during development.
 */
export const isPreviewMode = (): boolean => {
  return (
    process.env.NODE_ENV === "development" || cookies()?.get("preview")?.value === process.env.DRUPAL_PREVIEW_SECRET
  )
}
