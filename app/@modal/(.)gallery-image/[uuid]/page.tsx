import InterceptionModal from "@components/elements/interception-modal";
import {randomUUID} from "crypto";
import Image from "next/image";
import {graphqlClient} from "@lib/gql/gql-client";
import {MediaStanfordGalleryImage} from "@lib/gql/__generated__/drupal.d";

const Page = async ({params: {uuid}}: { params: { uuid: string } }) => {

  const captionId = randomUUID();
  let media: MediaStanfordGalleryImage | undefined;
  try {
    const query = await graphqlClient().Media({uuid});
    if (query.media?.__typename === 'MediaStanfordGalleryImage') media = query.media as MediaStanfordGalleryImage;
  } catch (e) {
  }
  if (!media?.suGalleryImage?.url) return;

  return (
    <InterceptionModal aria-labelledby={captionId}>
      <figure className="h-full w-fit mx-auto table">
        <picture>
          <Image
            src={media.suGalleryImage.url}
            alt={media.suGalleryImage.alt || ''}
            height={media.suGalleryImage.height}
            width={media.suGalleryImage.width}
            className="max-w-full h-auto m-0 p-0"
          />
        </picture>
        {media.suGalleryCaption &&
          <figcaption
            id={captionId}
            className="bg-white text-right p-5 m-0 table-caption caption-bottom">
            {media.suGalleryCaption}
          </figcaption>
        }
      </figure>
    </InterceptionModal>
  )
}
export default Page;