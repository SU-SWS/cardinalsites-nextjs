import {graphqlClient} from "@lib/gql/gql-client"
import {MediaDocument, MediaQuery} from "@lib/gql/__generated__/graphql"
import InterceptionModal from "@components/elements/interception-modal"
import Oembed from "@components/elements/ombed"
import {notFound} from "next/navigation"
import {Slug} from "@lib/utils/utils"

// Vercel max execution. See https://vercel.com/docs/functions/configuring-functions/duration
export const maxDuration = 30

const Page = async ({params}: {params: Promise<{slug: Array<string>}>}) => {
  "use cache: remote"

  const uuid = (await params).slug.at(-1)
  if (!uuid) notFound()

  const media = await graphqlClient().request<MediaQuery>(MediaDocument, {uuid})
  if (media.media?.__typename !== "MediaVideo") return null

  return (
    <InterceptionModal aria-labelledby={uuid}>
      <Oembed url={media.media.mediaOembedVideo} />
    </InterceptionModal>
  )
}

export const generateStaticParams = async (): Promise<Array<Slug>> => {
  return [{slug: ["none"]}]
}

export default Page
