import {createHmac, timingSafeEqual} from "node:crypto"

/** A list's configuration, chosen by the server when it renders the list. */
export type ViewConfig = {
  viewId: string
  displayId: string
  contextualFilter: string[]
  hasHeadline: boolean
  pageSize: number
}

// Derived from an existing secret so no new environment variable is needed. The label keeps this key
// distinct from any other use of the revalidation secret.
const signingKey = () => {
  const secret = process.env.DRUPAL_REVALIDATE_SECRET
  return secret ? createHmac("sha256", secret).update("view-config").digest() : undefined
}

const sign = (key: Buffer, payload: string) => createHmac("sha256", key).update(payload).digest("base64url")

/**
 * Sign a list configuration so the browser can send it back with a "load more" request.
 *
 * The load-more server action is a public endpoint. Without a signature, anyone could call it with any
 * view, display and contextual filter, and each distinct combination would be a Drupal query and a new
 * cache entry. Only the page number and filter values come from the browser.
 *
 * @returns The signed configuration, or `undefined` if no signing secret is configured.
 */
export const signViewConfig = (config: ViewConfig): string | undefined => {
  const key = signingKey()
  if (!key) return
  const payload = Buffer.from(JSON.stringify(config)).toString("base64url")
  return `${payload}.${sign(key, payload)}`
}

/** Return the configuration if the signature is valid, otherwise `undefined`. */
export const verifyViewConfig = (token: unknown): ViewConfig | undefined => {
  const key = signingKey()
  if (!key || typeof token !== "string") return

  const [payload, signature, extra] = token.split(".")
  if (!payload || !signature || extra !== undefined) return

  const expected = Buffer.from(sign(key, payload))
  const given = Buffer.from(signature)
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return

  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString()) as ViewConfig
  } catch {
    return
  }
}
