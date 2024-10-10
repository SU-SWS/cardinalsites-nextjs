import {getPlaiceholder} from "plaiceholder"
import {ImageProps} from "next/image"
import {unstable_cache as nextCache} from "next/cache"

type ReturnProps = {
  placeholder?: ImageProps["placeholder"]
  blurDataURL?: ImageProps["blurDataURL"]
}

export const getImagePlaceholder = nextCache(async (src: string): Promise<ReturnProps> => {
  try {
    const buffer = await fetch(src, {cache: "no-cache"}).then(async res => Buffer.from(await res.arrayBuffer()))
    const {base64: blurDataURL} = await getPlaiceholder(buffer, {size: 10})
    return {placeholder: "blur", blurDataURL}
  } catch (err) {
    console.warn(err instanceof Error ? err.message : "Unable to produce placeholder image: " + src)
    return {}
  }
})
