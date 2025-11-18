import {redirect} from "next/navigation"
import {H1, H2} from "@components/elements/headers"
import {HtmlHTMLAttributes} from "react"
import {NodeStanfordMedia} from "@lib/gql/__generated__/drupal.d"
import ReverseVisualOrder from "@components/elements/reverse-visual-order"
import NodePageMetadata from "@components/nodes/pages/node-page-metadata"
import Wysiwyg from "@components/elements/wysiwyg"
import Button from "@components/elements/button"
import Link from "@components/elements/link"
import Oembed from "@components/elements/ombed"
import {graphqlClient} from "@lib/gql/gql-client"
import twMerge from "@lib/utils/twMerge"
import {clsx} from "clsx"

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  node: NodeStanfordMedia
  headingLevel?: "h2" | "h3"
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
  const upNextMediaQuery = node.suMediaSeries
    ? await graphqlClient().stanfordMedia({filter: {series: node.suMediaSeries}})
    : undefined
  const upNextMedia = upNextMediaQuery?.stanfordMedia?.results.filter(
    item => item.uuid !== node.uuid
  ) as Array<NodeStanfordMedia>

  return (
    <article
      className={twMerge("centered mt-32 gap-20", clsx({"grid grid-cols-3-1": upNextMedia.length > 0}))}
      {...props}
    >
      <NodePageMetadata pageTitle={node.title} metatags={node.metatag} backupDescription={node.suMediaDek} />
      <div>
        <ReverseVisualOrder className="mb-20 gap-20 border-b border-black-20 pb-20">
          <div className="flex">
            <div className="flex-grow">
              <H1>{node.title}</H1>

              {topics && <div>{topics.map(topic => topic.name).join(", ")}</div>}

              {node.suMediaDek && <div className="mb-10">{node.suMediaDek}</div>}
              {node.suMediaPerson && (
                <div>
                  {node.suMediaPerson.map((person, i) => (
                    <span key={person.uuid}>
                      <Link href={person.suPersonProfileLink?.url || person.path || "#"}>{person.title}</Link>
                      &nbsp;{person.suPersonShortTitle}
                      {i + 1 !== node.suMediaPerson?.length && ","}
                    </span>
                  ))}
                </div>
              )}

              {(node.suMediaDate || node.suMediaDuration) && (
                <div>
                  {node.suMediaDate && (
                    <time dateTime={new Date(node.suMediaDate.time).toISOString().substring(0, 10)}>{publishDate}</time>
                  )}
                  {node.suMediaDate && node.suMediaDuration && <span>&nbsp;|&nbsp;</span>}
                  {node.suMediaDuration && <span>Duration: {node.suMediaDuration}</span>}
                </div>
              )}

              {node.suMediaTranscript && (
                <Button href="#" secondary>
                  Read Transcript
                </Button>
              )}
            </div>
            {(node.suMediaSeries || node.suMediaSeason || node.suMediaEpisode) && (
              <div>
                <strong>Part of Series</strong>
                {node.suMediaSeries && <div>{node.suMediaSeries}</div>}

                {node.suMediaSeason && <div>{node.suMediaSeason}</div>}
                {node.suMediaEpisode && <div>{node.suMediaEpisode}</div>}
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
                  <Link href="#">{clip.name}</Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {upNextMedia.length > 0 && (
        <div>
          <H2>Next</H2>
          <ul className="list-unstyled">
            {upNextMedia.map(media => (
              <li key={media.uuid}>
                <Link href={media.suMediaSource?.url || media.path || "#"}>{media.title}</Link>
                {media.suMediaDate && (
                  <div>
                    {new Date(media.suMediaDate.time).toLocaleDateString("en-us", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                      timeZone: media.suMediaDate.timezone,
                    })}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  )
}

export default StanfordMediaPage
