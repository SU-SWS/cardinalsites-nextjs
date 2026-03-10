import type {Metadata} from "next"
import {getPathFromContext} from "@lib/utils/utils"
import {graphqlClient} from "@lib/gql/gql-client"
import {MediaDocument, MediaQuery} from "@lib/gql/__generated__/graphql"
import Oembed from "@components/elements/ombed"
import {H1} from "@components/elements/headers"
import Button from "@components/elements/button"

export const metadata: Metadata = {
  robots: {index: false},
}

const Page = async ({params}: {params: Promise<{slug: Array<string>}>}) => {
  const slug = (await params).slug.slice(0, -1)
  const uuid = (await params).slug.at(-1)
  const nodePath = getPathFromContext(slug)

  const media = await graphqlClient().request<MediaQuery>(MediaDocument, {uuid})
  if (media.media?.__typename !== "MediaVideo") return null

  return (
    <div className="centered my-32">
      <H1>{media.media.name}</H1>

      <Oembed url={media.media.mediaOembedVideo} />

      <Button href={nodePath} className="ml-auto mt-32 block">
        Back to content
      </Button>
    </div>
  )
}
export default Page
