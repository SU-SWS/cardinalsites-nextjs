import Image, {ImageProps} from "next/image"
import {Suspense} from "react"
import {getImagePlaceholder} from "@lib/utils/get-image-placeholder"

type Props = Omit<ImageProps, "src" | "placeholder" | "blurDataURL"> & {
  /**
   * Absolute image url path.
   */
  src: string
}

/**
 * `next/image` with a blur placeholder derived from the source file.
 *
 * Deriving the placeholder downloads the original from Drupal, which is slow enough to hold up
 * the server component rendering it. Putting that behind Suspense lets the surrounding page
 * stream with a plain image immediately and swap in the blurred variant once it resolves.
 */
// `alt` is pulled out of the props rather than spread so jsx-a11y can see it on the element.
const BlurImage = ({alt, ...props}: Props) => (
  <Suspense fallback={<Image alt={alt} {...props} />}>
    <ImageWithPlaceholder alt={alt} {...props} />
  </Suspense>
)

const ImageWithPlaceholder = async ({alt, ...props}: Props) => (
  <Image alt={alt} {...props} {...await getImagePlaceholder(props.src)} />
)

export default BlurImage
