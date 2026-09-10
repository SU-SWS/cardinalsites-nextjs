import {getPlaiceholder} from "plaiceholder"
import {ImageProps} from "next/image"
import {cacheTag} from "next/cache"

type ReturnProps = {
  placeholder?: ImageProps["placeholder"]
  blurDataURL?: ImageProps["blurDataURL"]
}

/**
 * Drupal's GraphQL schema only exposes the original file url, so deriving a placeholder means
 * pulling the full image across. Skip anything past this budget rather than transfer and decode
 * a very large original for the sake of ten pixels of it.
 */
const MAX_SOURCE_BYTES = 5 * 1024 * 1024

/**
 * Produce a blurred, base64 encoded placeholder for a Drupal image.
 *
 * Tagged so that replacing a file at an existing url can invalidate the derived placeholder;
 * without a tag the entry would sit in the cache untouched for the life of the deployment.
 */
export const getImagePlaceholder = async (src: string): Promise<ReturnProps> => {
  "use cache: remote"
  cacheTag("all-cache", "images")
  if (!src.includes(process.env.NEXT_PUBLIC_DRUPAL_BASE_URL as string)) return {}

  try {
    const response = await fetch(src)
    if (!response.ok) throw new Error(`Responded ${response.status} ${response.statusText} for ${src}`)

    // Headers resolve ahead of the body, so an oversized original can be dropped early. A missing
    // content-length reads as 0 here, which falls through to the normal path.
    if (Number(response.headers.get("content-length")) > MAX_SOURCE_BYTES) {
      await response.body?.cancel()
      return {}
    }

    const buffer = Buffer.from(await response.arrayBuffer())
    const {base64: blurDataURL} = await getPlaiceholder(buffer, {size: 10})
    return {placeholder: "blur", blurDataURL}
  } catch (err) {
    console.warn(err instanceof Error ? err.message : "Unable to produce placeholder image: " + src)
    return {}
  }
}
