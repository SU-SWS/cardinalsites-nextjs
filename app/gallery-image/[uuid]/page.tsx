import {notFound} from "next/navigation";
import {H1} from "@components/elements/headers";
import Image from "next/image";
import {MediaStanfordGalleryImage} from "@lib/gql/__generated__/drupal.d";
import {graphqlClient} from "@lib/gql/gql-client";

export const metadata = {
  title: 'Gallery Image',
  robots: {
    index: false
  }
}

const Page = async ({params: {uuid}}: { params: { uuid: string } }) => {
  let media: MediaStanfordGalleryImage | undefined;
  try {
    const query = await graphqlClient().Media({uuid});
    if (query.media?.__typename === 'MediaStanfordGalleryImage') media = query.media as MediaStanfordGalleryImage;
  } catch (e) {
  }
  if (!media?.suGalleryImage?.url) notFound();

  return (
    <div className="centered mt-32">
      <H1>{media.suGalleryImage?.alt || "Media"}</H1>

      <figure className="h-full w-fit mx-auto table">
        <picture>
          <Image
            src={media.suGalleryImage.url}
            alt=""
            width={media.suGalleryImage.width}
            height={media.suGalleryImage.height}
            className="max-w-full h-auto m-0 p-0"
          />
        </picture>
        {media.suGalleryCaption &&
          <figcaption
            className="bg-white text-right p-5 m-0 table-caption caption-bottom">
            {media.suGalleryCaption}
          </figcaption>
        }
      </figure>
    </div>
  )
}

export default Page