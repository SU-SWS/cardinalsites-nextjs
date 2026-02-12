"use cache"

import {graphqlClient} from "@lib/gql/gql-client"
import InterceptionModal from "@components/elements/interception-modal"
import Oembed from "@components/elements/ombed"

const Page = async ({params}: {params: Promise<{uuid: Array<string>}>}) => {
  const uuids = (await params).uuid
  if (uuids.length !== 2) return null

  const media = await graphqlClient().Media({uuid: uuids[1]})
  if (media.media?.__typename !== "MediaVideo") return null
  return (
    <InterceptionModal aria-labelledby={media.media.uuid}>
      <Oembed url={media.media.mediaOembedVideo} />
    </InterceptionModal>
  )
}
export default Page
