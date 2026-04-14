import {ImageProps} from "next/image"

type ReturnProps = {
  placeholder?: ImageProps["placeholder"]
  blurDataURL?: ImageProps["blurDataURL"]
}

const FETCH_TIMEOUT_MS = 5000

/**
 * The `tiny_blur` derivative is 10x10, a few hundred bytes. Anything far larger isn't that
 * derivative, so it's dropped rather than inlined into the page.
 */
const MAX_IMAGE_BYTES = 20 * 1024

/**
 * Produce a base64 encoded placeholder from a Drupal `tiny_blur` image style derivative.
 *
 * Drupal does the resizing, so this only downloads the already tiny derivative and inlines it as
 * a data url; Next's blur placeholder applies the blur. The derivative url carries an `?itok=`
 * token, which is needed here so Drupal will generate the file on its first request.
 *
 * Tagged so that replacing a file at an existing url can invalidate the derived placeholder;
 * without a tag the entry would sit in the cache untouched for the life of the deployment.
 */
export const getImagePlaceholder = async (blurSrc?: string): Promise<ReturnProps> => {
  // Only derive placeholders for our own media. This function fetches whatever url it is handed,
  // so it must not be pointed at arbitrary hosts.
  if (!blurSrc?.startsWith(process.env.NEXT_PUBLIC_DRUPAL_BASE_URL as string)) return {}

  try {
    const response = await fetch(blurSrc, {signal: AbortSignal.timeout(FETCH_TIMEOUT_MS)})
    if (!response.ok) throw new Error(`Responded ${response.status} ${response.statusText} for ${blurSrc}`)

    const contentType = response.headers.get("content-type")
    if (!contentType?.startsWith("image/") || Number(response.headers.get("content-length")) > MAX_IMAGE_BYTES) {
      await response.body?.cancel()
      return {}
    }

    const buffer = Buffer.from(await response.arrayBuffer())
    if (buffer.byteLength > MAX_IMAGE_BYTES) return {}

    return {placeholder: "blur", blurDataURL: `data:${contentType};base64,${buffer.toString("base64")}`}
  } catch (err) {
    console.warn(err instanceof Error ? err.message : "Unable to produce placeholder image: " + blurSrc)
    return {}
  }
}
