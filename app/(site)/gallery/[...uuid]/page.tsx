import {H1} from "@components/elements/headers"
import {graphqlClient} from "@lib/gql/gql-client"
import {notFound} from "next/navigation"
import {ParagraphDocument, ParagraphQuery, ParagraphStanfordGallery} from "@lib/gql/__generated__/graphql"
import Image from "next/image"
import {cacheTag} from "next/cache"
import {isUuid} from "@lib/utils/security"
import {cacheFailure} from "@lib/gql/gql-queries"

export const metadata = {
  title: "Gallery Image",
  robots: {
    index: false,
  },
}

type Props = {
  params: Promise<{uuid: string[]}>
}

// Vercel max execution. See https://vercel.com/docs/functions/configuring-functions/duration
export const maxDuration = 30

export const instant = false

/**
 * Resolved outside of a Suspense boundary so `notFound()` runs before streaming starts and an unknown gallery returns
 * a real 404 instead of a 200 soft-404 that crawlers keep requesting. In-app navigation to a gallery is handled by the
 * intercepting modal route, so this page is only rendered on a full page load.
 */
const Page = async (props: Props) => {
  const [paragraphId, mediaUuid] = (await props.params).uuid

  // Reject malformed ids before they reach Drupal or create a cache entry.
  if (!isUuid(paragraphId) || (mediaUuid && !isUuid(mediaUuid))) notFound()

  const paragraph = await getGallery(paragraphId)
  if (!paragraph) notFound()

  return <GalleryContent paragraph={paragraph} mediaUuid={mediaUuid} />
}

const getGallery = async (paragraphId: string): Promise<ParagraphStanfordGallery | undefined> => {
  "use cache: remote"
  cacheTag("all-cache", "paragraphs", `paragraph:${paragraphId}`)

  try {
    const paragraphQuery = await graphqlClient().request<ParagraphQuery>(ParagraphDocument, {uuid: paragraphId})
    if (paragraphQuery.paragraph?.__typename === "ParagraphStanfordGallery")
      return paragraphQuery.paragraph as ParagraphStanfordGallery
  } catch (e) {
    cacheFailure(`Unable to fetch gallery ${paragraphId}`, e)
  }
}

const GalleryContent = ({paragraph, mediaUuid}: {paragraph: ParagraphStanfordGallery; mediaUuid?: string}) => {
  let galleryImages = mediaUuid
    ? paragraph.suGalleryImages?.filter(image => image.uuid === mediaUuid)
    : paragraph.suGalleryImages

  galleryImages = galleryImages?.filter(image => !!image.suGalleryImage?.url)

  return (
    <div className="mt-64 centered">
      <H1>{paragraph.suGalleryHeadline || "Media"}</H1>
      {galleryImages?.map(galleryImage => {
        if (!galleryImage.suGalleryImage?.url) return

        return (
          <figure key={galleryImage.uuid}>
            <Image
              src={galleryImage.suGalleryImage.url}
              width={galleryImage.suGalleryImage.width}
              height={galleryImage.suGalleryImage.height}
              sizes="(max-width: 1200px) 100vw, 1200px"
              alt=""
            />

            {galleryImage.suGalleryCaption && <figcaption>{galleryImage.suGalleryCaption}</figcaption>}
          </figure>
        )
      })}
    </div>
  )
}

export const generateStaticParams = async (): Promise<Array<{uuid: string[]}>> => [{uuid: ["none"]}]

export default Page
