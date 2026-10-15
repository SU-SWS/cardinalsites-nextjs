import {redirect} from "next/navigation"
import {H1, H2, H3} from "@components/elements/headers"
import {HtmlHTMLAttributes, Suspense} from "react"
import {NodeStanfordMedia, StanfordMediaDocument, StanfordMediaQuery} from "@lib/gql/__generated__/graphql"
import ReverseVisualOrder from "@components/elements/reverse-visual-order"
import Wysiwyg from "@components/elements/wysiwyg"
import Button from "@components/elements/button"
import Link from "@components/elements/link"
import Oembed from "@components/elements/oembed"
import {graphqlClient} from "@lib/gql/gql-client"
import Image from "next/image"
import {getIdFromText, getTimeDuration} from "@lib/utils/text-tools"
import {cacheTag} from "next/cache"
import {cacheFailure} from "@lib/gql/gql-queries"

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  node: NodeStanfordMedia
}

const StanfordMediaPage = async ({node, ...props}: Props) => {
  if (node.suMediaSource?.url) redirect(node.suMediaSource.url)

  const publishDate = node.suMediaDate
    ? new Date(node.suMediaDate.time).toLocaleDateString("en-us", {
        month: "long",
        day: "numeric",
        year: "numeric",
        timeZone: node.suMediaDate.timezone,
      })
    : undefined

  const topics = node.suMediaTypes?.slice(0, 3)

  return (
    <article className="mt-64 centered flex gap-40" {...props}>
      <div className="grow">
        <ReverseVisualOrder className="mb-40 gap-40 border-b border-black-20 pb-40">
          <div className="flex">
            <div className="grow">
              <H1>{node.title}</H1>

              {topics && <div>{topics.map(topic => topic.name).join(", ")}</div>}

              {node.suMediaDek && <div className="mb-20">{node.suMediaDek}</div>}
              {node.suMediaPerson && (
                <div className="mb-20">
                  {node.suMediaPerson.map((person, i) => (
                    <span key={person.uuid}>
                      <Link
                        href={person.suPersonProfileLink?.url || person.path}
                        className="font-normal text-digital-red no-underline hocus:text-black hocus:underline"
                      >
                        {person.title}
                      </Link>
                      &nbsp;{person.suPersonShortTitle}
                      {i + 1 !== node.suMediaPerson?.length && ","}
                    </span>
                  ))}
                </div>
              )}

              {(node.suMediaDate || node.suMediaDuration) && (
                <div className="mb-20">
                  {node.suMediaDate && (
                    <time dateTime={new Date(node.suMediaDate.time).toISOString().substring(0, 10)}>{publishDate}</time>
                  )}
                  {node.suMediaDate && node.suMediaDuration && <span>&nbsp;|&nbsp;</span>}
                  {node.suMediaDuration && <span>Duration: {getTimeDuration(node.suMediaDuration)}</span>}
                </div>
              )}

              {node.suMediaTranscript && (
                <Button href="#" secondary>
                  Read Transcript
                </Button>
              )}
            </div>
            {(node.suMediaSeries || node.suMediaSeason || node.suMediaEpisode) && (
              <div className="w-3/12 space-y-5 border-t border-black-30 pt-10">
                <strong>Part of Series</strong>
                {node.suMediaSeries && <div>{node.suMediaSeries}</div>}

                {node.suMediaSeason && <div>Season {node.suMediaSeason.replace(/^season /i, "")}</div>}
                {node.suMediaEpisode && <div>Episode {node.suMediaEpisode.replace(/^epidsode /i, "")}</div>}
              </div>
            )}
          </div>
          <div>
            {node.suMediaAudioVideo.__typename === "MediaVideo" && (
              <Oembed url={node.suMediaAudioVideo.mediaOembedVideo} />
            )}

            {node.suMediaAudioVideo.__typename === "MediaSdr" && (
              <Oembed url={node.suMediaAudioVideo.mediaEmbeddableOembed} />
            )}

            {node.suMediaAudioVideo.__typename === "MediaEmbeddable" &&
              !node.suMediaAudioVideo.mediaEmbeddableCode &&
              node.suMediaAudioVideo.mediaEmbeddableOembed && (
                <Oembed url={node.suMediaAudioVideo.mediaEmbeddableOembed} />
              )}

            {node.suMediaAudioVideo.__typename === "MediaEmbeddable" && node.suMediaAudioVideo.mediaEmbeddableCode && (
              <div dangerouslySetInnerHTML={{__html: node.suMediaAudioVideo.mediaEmbeddableCode}} />
            )}
          </div>
        </ReverseVisualOrder>

        <Wysiwyg html={node.body?.processed} className="centered mb-64 xl:max-w-980" />

        {!!node.suMediaClips?.length && (
          <div>
            <H2>Video clips from: {node.title}</H2>
            <ul className="list-unstyled">
              {node.suMediaClips.map(clip => (
                <li key={clip.uuid} className="mt-20 border-t border-black-20 pt-20">
                  <Link href={clip.path} className="text-digital-red no-underline hocus:text-black hocus:underline">
                    {clip.title}
                  </Link>
                  {clip.suMediaDuration && <div>{getTimeDuration(clip.suMediaDuration)}</div>}
                  {clip.suMediaDek && <div>{clip.suMediaDek}</div>}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <Suspense>
        <NextMedia node={node} />
      </Suspense>
    </article>
  )
}

const NextMedia = async ({node}: {node: NodeStanfordMedia}) => {
  "use cache: remote"

  cacheTag("all-cache", "paths", `paths:${node.path}`)
  let upNextMediaQuery: StanfordMediaQuery | undefined
  try {
    upNextMediaQuery = node.suMediaSeries
      ? await graphqlClient().request<StanfordMediaQuery>(StanfordMediaDocument, {filter: {series: node.suMediaSeries}})
      : undefined
  } catch (e) {
    cacheFailure(`Unable to fetch the next media in ${node.path}`, e)
  }
  const nextMedia = upNextMediaQuery?.stanfordMedia?.results.filter(
    item => item.uuid !== node.uuid
  ) as Array<NodeStanfordMedia>

  if (!nextMedia?.length) return null

  return (
    <aside className="w-1/4">
      <H2>Next</H2>
      <ul className="list-unstyled">
        {nextMedia.map(media => (
          <li key={media.uuid}>
            <UpNextMedia media={media} />
          </li>
        ))}
      </ul>
    </aside>
  )
}

const UpNextMedia = ({media}: {media: NodeStanfordMedia}) => {
  const id = getIdFromText(media.title)
  return (
    <article aria-labelledby={id}>
      <ReverseVisualOrder>
        <Link
          href={media.suMediaSource?.url || media.path}
          className="text-black no-underline hocus:text-digital-red hocus:underline"
        >
          <H3 id={id}>{media.title}</H3>
        </Link>
        {media.suMediaImage?.mediaImage.url && (
          <div className="relative aspect-3/2">
            <Image
              src={media.suMediaImage.mediaImage.url}
              alt={media.suMediaImage.mediaImage.alt || ""}
              fill
              className="object-fill"
            />
          </div>
        )}
      </ReverseVisualOrder>
      {media.suMediaDate && (
        <div className="text-black-80">
          {new Date(media.suMediaDate.time).toLocaleDateString("en-us", {
            month: "long",
            day: "numeric",
            year: "numeric",
            timeZone: media.suMediaDate.timezone,
          })}
        </div>
      )}
      {media.suMediaDek && <p>{media.suMediaDek}</p>}
    </article>
  )
}

export default StanfordMediaPage
