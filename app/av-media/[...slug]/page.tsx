import type {Metadata} from "next"
import {getPathFromContext} from "@lib/utils/utils"
import {graphqlClient} from "@lib/gql/gql-client"
import {
  AudioVisualDocument,
  AudioVisualQuery,
  AudioVisualQueryVariables,
  MediaDocument,
  MediaQuery,
} from "@lib/gql/__generated__/graphql"
import Oembed from "@components/elements/ombed"
import {H1} from "@components/elements/headers"
import Button from "@components/elements/button"

export const metadata: Metadata = {
  robots: {index: false},
}

// Vercel max execution. See https://vercel.com/docs/functions/configuring-functions/duration
export const maxDuration = 30

type Param = {slug: Array<string>}

const Page = async ({params}: {params: Promise<Param>}) => {
  "use cache: remote"

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

export const generateStaticParams = async () => {
  let fetchMore = true
  let after: AudioVisualQueryVariables["after"] = undefined
  const slugs: Array<Param> = [{slug: ["none"]}]

  // Only build pages if we should build everything by using -1 for BUILD_PAGES.
  if (!process.env.BUILD_PAGES || Number(process.env.BUILD_PAGES) > -1) return slugs

  while (fetchMore) {
    const query: AudioVisualQuery = await graphqlClient().request<AudioVisualQuery, AudioVisualQueryVariables>(
      AudioVisualDocument,
      {
        first: 1000,
        after,
      }
    )
    fetchMore = false

    query.nodeStanfordMediaItems?.nodes.forEach(node => {
      node.suMediaAudioVideo.slice(1).forEach(video => {
        if (!node.path) return
        const slug = node.path.replace(/^\//, "").split("/")
        slug.push(video.uuid)

        slugs.push({slug})
      })
    })

    after = query.nodeStanfordMediaItems.pageInfo.endCursor
    fetchMore = query.nodeStanfordMediaItems.pageInfo.hasNextPage
  }

  return slugs
}

export default Page
