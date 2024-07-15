import {H2} from "@components/elements/headers"
import Link from "@components/elements/link"
import Image from "next/image"
import {Hit as HitType} from "instantsearch.js"

export type DefaultAlgoliaHit = {
  url: string
  title: string
  summary?: string
  photo?: string
  updated?: number
}

const DefaultHit = ({hit}: {hit: HitType<DefaultAlgoliaHit>}) => {
  const hitUrl = new URL(hit.url)

  return (
    <article className="flex justify-between gap-20 py-12 @container">
      <div>
        <H2 className="type-3">
          <Link href={hit.url.replace(hitUrl.origin, "")}>{hit.title}</Link>
        </H2>
        <p>{hit.summary}</p>

        {hit.updated && (
          <div className="text-2xl">
            Last Updated:{" "}
            {new Date(hit.updated * 1000).toLocaleDateString("en-us", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </div>
        )}
      </div>

      {hit.photo && (
        <div className="relative hidden aspect-1 h-[150px] w-[150px] shrink-0 @6xl:block">
          <Image
            className="object-cover"
            src={hit.photo.replace(hitUrl.origin, `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}`)}
            alt=""
            fill
          />
        </div>
      )}
    </article>
  )
}

export default DefaultHit
