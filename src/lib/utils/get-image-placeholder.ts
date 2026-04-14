import {getPlaiceholder} from "plaiceholder"
import {ImageProps} from "next/image"

type ReturnProps = {
  placeholder?: ImageProps["placeholder"]
  blurDataURL?: ImageProps["blurDataURL"]
}

export const getImagePlaceholder = async (src: string): Promise<ReturnProps> => {
  if (!src.includes(process.env.NEXT_PUBLIC_DRUPAL_BASE_URL as string)) return {}

  try {
    // Cache the download so an image reused across pages is only fetched once per build.
    const buffer = await fetch(src, {cache: "force-cache"}).then(async res => Buffer.from(await res.arrayBuffer()))
    const {base64: blurDataURL} = await getPlaiceholder(buffer, {size: 10})
    return {placeholder: "blur", blurDataURL}
  } catch (err) {
    console.warn(err instanceof Error ? err.message : "Unable to produce placeholder image: " + src)
    return {}
  }
}
