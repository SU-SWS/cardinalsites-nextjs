import {H1} from "@components/elements/headers"
import {graphqlClient} from "@lib/gql/gql-client"
import {notFound} from "next/navigation"
import {ParagraphDocument, ParagraphQuery, ParagraphStanfordGallery} from "@lib/gql/__generated__/graphql"
import Image from "next/image"

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

const Page = async (props: Props) => {
  "use cache: remote"
  const params = await props.params
  const [paragraphId, mediaUuid] = params.uuid

  const paragraphQuery = await graphqlClient().request<ParagraphQuery>(ParagraphDocument, {uuid: paragraphId})
  if (paragraphQuery.paragraph?.__typename !== "ParagraphStanfordGallery") notFound()

  const paragraph = paragraphQuery.paragraph as ParagraphStanfordGallery
  let galleryImages = mediaUuid
    ? paragraph.suGalleryImages?.filter(image => image.uuid === mediaUuid)
    : paragraph.suGalleryImages

  galleryImages = galleryImages?.filter(image => !!image.suGalleryImage?.url)

  return (
    <div className="centered mt-32">
      <H1>{paragraph.suGalleryHeadline || "Media"}</H1>
      {galleryImages?.map(galleryImage => {
        if (!galleryImage.suGalleryImage?.url) return

        return (
          <figure key={galleryImage.uuid}>
            <Image
              src={galleryImage.suGalleryImage.url}
              width={galleryImage.suGalleryImage.width}
              height={galleryImage.suGalleryImage.height}
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
