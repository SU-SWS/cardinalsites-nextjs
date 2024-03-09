import InterceptionModal from "@components/elements/interception-modal";
import Image from "next/image";
import {graphqlClient} from "@lib/gql/gql-client";
import {ParagraphStanfordGallery} from "@lib/gql/__generated__/drupal.d";
import {notFound} from "next/navigation";
import {useId} from "react";

type Props = {
  params: { uuid: string[] }
}

const Page = async ({params: {uuid}}: Props) => {
  const captionId = useId();
  const [paragraphId, mediaUuid] = uuid

  const paragraphQuery = await graphqlClient().Paragraph({uuid: paragraphId});
  if (paragraphQuery.paragraph?.__typename !== "ParagraphStanfordGallery") notFound();

  const paragraph = paragraphQuery.paragraph as ParagraphStanfordGallery;
  let galleryImages = mediaUuid ? paragraph.suGalleryImages?.filter(image => image.id === mediaUuid) : paragraph.suGalleryImages;

  galleryImages = galleryImages?.filter(image => !!image.suGalleryImage?.url)

  return (
    <InterceptionModal aria-labelledby={captionId}>
      {galleryImages?.map(galleryImage => {
        if (!galleryImage.suGalleryImage?.url) return;

        return (
          <figure key={galleryImage.id}>
            <picture>
              <Image
                src={galleryImage.suGalleryImage.url}
                width={galleryImage.suGalleryImage.width}
                height={galleryImage.suGalleryImage.height}
                alt={galleryImage.suGalleryImage.alt || ""}
                className="max-w-full h-auto m-0 p-0"
              />
            </picture>
            {galleryImage.suGalleryCaption &&
              <figcaption id={captionId} className="bg-white text-right p-5 m-0 table-caption caption-bottom w-full">
                {galleryImage.suGalleryCaption}
              </figcaption>
            }
          </figure>
        )
      })}
    </InterceptionModal>
  )
}
export default Page;