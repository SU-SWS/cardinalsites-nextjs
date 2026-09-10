import {graphqlClient} from "@lib/gql/gql-client"
import {MediaDocument, MediaQuery} from "@lib/gql/__generated__/graphql"
import InterceptionModal from "@components/elements/interception-modal"
import Oembed from "@components/elements/ombed"
import {notFound} from "next/navigation"
import type {Slug} from "@lib/@types/types"
import {H2} from "@components/elements/headers"
import {cacheTag} from "next/cache"

// Vercel max execution. See https://vercel.com/docs/functions/configuring-functions/duration
export const maxDuration = 30

const Page = async ({params}: {params: Promise<{slug: Array<string>}>}) => {
  "use cache: remote"
  const uuid = (await params).slug.at(-1)
  if (!uuid) notFound()
  cacheTag("all-cache", "media", `media:${uuid}`)

  const {media} = await graphqlClient().request<MediaQuery>(MediaDocument, {uuid})
  if (!media) return null

  return (
    <InterceptionModal aria-labelledby={uuid}>
      <H2 id={uuid}>{media.name}</H2>
      {media.__typename === "MediaVideo" && <Oembed url={media.mediaOembedVideo} />}

      {media.__typename === "MediaSdr" && <Oembed url={media.sdrUrl} />}

      {media.__typename === "MediaEmbeddable" && !media.mediaEmbeddableCode && media.mediaEmbeddableOembed && (
        <Oembed url={media.mediaEmbeddableOembed} />
      )}

      {media.__typename === "MediaEmbeddable" && media.mediaEmbeddableCode && (
        <div dangerouslySetInnerHTML={{__html: media.mediaEmbeddableCode}} />
      )}
    </InterceptionModal>
  )
}

export const generateStaticParams = async (): Promise<Array<Slug>> => [{slug: ["none"]}]

export default Page
