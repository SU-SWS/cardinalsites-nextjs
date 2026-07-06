import {redirect} from "next/navigation"
import {H1, H2, H3} from "@components/elements/headers"
import {HtmlHTMLAttributes, Suspense} from "react"
import {NodeStanfordMedia, StanfordMediaDocument, StanfordMediaQuery} from "@lib/gql/__generated__/graphql"
import ReverseVisualOrder from "@components/elements/reverse-visual-order"
import NodePageMetadata from "@components/nodes/pages/node-page-metadata"
import Wysiwyg from "@components/elements/wysiwyg"
import Button from "@components/elements/button"
import Link from "@components/elements/link"
import Oembed from "@components/elements/ombed"
import {graphqlClient} from "@lib/gql/gql-client"
import Image from "next/image"
import {getIdFromText, getTimeDuration} from "@lib/utils/text-tools"
import {cacheTag} from "next/cache"

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
    <article className="centered mt-32 flex gap-20" {...props}>
      <NodePageMetadata pageTitle={node.title} metatags={node.metatag} backupDescription={node.suMediaDek} />
      <div className="flex-grow">
        <ReverseVisualOrder className="mb-20 gap-20 border-b border-black-20 pb-20">
          <div className="flex">
            <div className="flex-grow">
              <H1>{node.title}</H1>

              {topics && <div>{topics.map(topic => topic.name).join(", ")}</div>}

              {node.suMediaDek && <div className="mb-10">{node.suMediaDek}</div>}
              {node.suMediaPerson && (
                <div className="mb-10">
                  {node.suMediaPerson.map((person, i) => (
                    <span key={person.uuid}>
                      <Link
                        href={person.suPersonProfileLink?.url || person.path || "#"}
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
                <div className="mb-10">
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
              <div className="w-3/12 space-y-5 border-t border-black-30 pt-5">
                <strong>Part of Series</strong>
                {node.suMediaSeries && <div>{node.suMediaSeries}</div>}

                {node.suMediaSeason && <div>Season {node.suMediaSeason.replace(/^season /i, "")}</div>}
                {node.suMediaEpisode && <div>Episode {node.suMediaEpisode.replace(/^epidsode /i, "")}</div>}
              </div>
            )}
          </div>
          <div>
            {node.suMediaAudioVideo[0].__typename === "MediaVideo" && (
              <Oembed url={node.suMediaAudioVideo[0].mediaOembedVideo} />
            )}
          </div>
        </ReverseVisualOrder>

        <Wysiwyg html={node.body?.processed} className="centered mb-32 xl:max-w-[980px]" />

        {node.suMediaAudioVideo.length > 1 && (
          <div>
            <H2>Video clips from: {node.title}</H2>
            <ul className="list-unstyled">
              {node.suMediaAudioVideo.slice(1).map(clip => (
                <li key={clip.uuid} className="mt-10 border-t border-black-20 pt-10">
                  <Link
                    href={`/av-media${node.path}/${clip.uuid}`}
                    className="text-digital-red no-underline hocus:text-black hocus:underline"
                  >
                    {clip.name}
                  </Link>
                  {clip.__typename === "MediaVideo" && clip.suVideoDuration && (
                    <div>{getTimeDuration(clip.suVideoDuration)}</div>
                  )}
                  {clip.__typename === "MediaVideo" && clip.suMediaDescription && <div>{clip.suMediaDescription}</div>}
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
  cacheTag("paths", `paths:${node.path}`)
  const upNextMediaQuery = node.suMediaSeries
    ? await graphqlClient().request<StanfordMediaQuery>(StanfordMediaDocument, {filter: {series: node.suMediaSeries}})
    : undefined
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
          href={media.suMediaSource?.url || media.path || "#"}
          className="text-black no-underline hocus:text-digital-red hocus:underline"
        >
          <H3 id={id}>{media.title}</H3>
        </Link>
        {media.suMediaImage?.mediaImage.url && (
          <div className="relative aspect-[3/2]">
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
