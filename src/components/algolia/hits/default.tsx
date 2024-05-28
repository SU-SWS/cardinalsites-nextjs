import {H2} from "@components/elements/headers";
import Link from "@components/elements/link";
import Image from "next/image";
import {Hit as HitType} from "instantsearch.js";

export type DefaultAlgoliaHit = {
  url: string
  title: string
  summary?: string
  photo?: string
  updated?: number
}

const DefaultHit = ({hit}: { hit: HitType<DefaultAlgoliaHit> }) => {
  const hitUrl = new URL(hit.url);

  return (
    <article className="@container flex justify-between gap-20 py-12">
      <div>
        <H2 className="text-m2">
          <Link href={hit.url.replace(hitUrl.origin, "")}>
            {hit.title}
          </Link>
        </H2>
        <p>{hit.summary}</p>

        {hit.updated &&
          <div className="text-2xl">
            Last Updated: {new Date(hit.updated * 1000).toLocaleDateString("en-us", {
            month: "long",
            day: "numeric",
            year: "numeric"
          })}
          </div>
        }
      </div>

      {hit.photo &&
        <div className="hidden @6xl:block relative shrink-0 aspect-1 h-[150px] w-[150px]">
          <Image
            className="object-cover"
            src={hit.photo.replace(hitUrl.origin, `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}`)}
            alt=""
            fill
          />
        </div>
      }
    </article>
  )
}

export default DefaultHit;