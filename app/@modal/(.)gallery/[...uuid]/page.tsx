import Image from "next/image"
import InterceptionModal from "@components/elements/interception-modal"
import Link from "@components/elements/link"
import {ParagraphStanfordGallery} from "@lib/gql/__generated__/drupal.d"
import {graphqlClient} from "@lib/gql/gql-client"
import {notFound} from "next/navigation"
import {useId} from "react"

type Props = {
  params: {uuid: string[]}
}

const Page = async ({params: {uuid}}: Props) => {
  const captionId = useId()
  const [paragraphId, mediaUuid] = uuid

  const paragraphQuery = await graphqlClient().Paragraph({uuid: paragraphId})
  if (paragraphQuery.paragraph?.__typename !== "ParagraphStanfordGallery") notFound()

  const paragraph = paragraphQuery.paragraph as ParagraphStanfordGallery

  const currentImageIndex = paragraph.suGalleryImages?.findIndex(image => image.id === mediaUuid) || 0
  const prevImageIndex = paragraph.suGalleryImages?.[currentImageIndex - 1] ? currentImageIndex - 1 : -1
  const nextImageIndex = paragraph.suGalleryImages?.[currentImageIndex + 1] ? currentImageIndex + 1 : -1

  let galleryImages = mediaUuid
    ? paragraph.suGalleryImages?.filter(image => image.id === mediaUuid)
    : paragraph.suGalleryImages

  galleryImages = galleryImages?.filter(image => !!image.suGalleryImage?.url)

  return (
    <InterceptionModal aria-labelledby={captionId}>
      {galleryImages?.map(galleryImage => {
        if (!galleryImage.suGalleryImage?.url) return

        return (
          <div key={galleryImage.id}>
            <figure className="table" key={galleryImage.id}>
              <picture>
                <Image
                  src={galleryImage.suGalleryImage.url}
                  width={galleryImage.suGalleryImage.width}
                  height={galleryImage.suGalleryImage.height}
                  alt={galleryImage.suGalleryImage.alt || ""}
                  className="m-0 h-auto max-w-full p-0"
                />
              </picture>
              {galleryImage.suGalleryCaption && (
                <figcaption id={captionId} className="m-0 table-caption w-full caption-bottom bg-white p-5 text-right">
                  {galleryImage.suGalleryCaption}
                </figcaption>
              )}
            </figure>
            {(prevImageIndex || nextImageIndex) && (
              <nav>
                <ul className="list-unstyled flex justify-between">
                  {prevImageIndex >= 0 && (
                    <li className="mr-auto">
                      <Link
                        className="text-white no-underline hocus:text-white hocus:underline"
                        href={`/gallery/${paragraph.id}/${paragraph.suGalleryImages?.[prevImageIndex].id}`}
                        replace={true}
                        scroll={false}
                      >
                        Previous Image
                      </Link>
                    </li>
                  )}
                  {nextImageIndex >= 0 && (
                    <li className="ml-auto">
                      <Link
                        className="text-white no-underline hocus:text-white hocus:underline"
                        href={`/gallery/${paragraph.id}/${paragraph.suGalleryImages?.[nextImageIndex].id}`}
                        replace={true}
                        scroll={false}
                      >
                        Next Image
                      </Link>
                    </li>
                  )}
                </ul>
              </nav>
            )}
          </div>
        )
      })}
    </InterceptionModal>
  )
}
export default Page
