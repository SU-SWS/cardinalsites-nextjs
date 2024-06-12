import Image from "next/image"
import Link from "@components/elements/link"
import {H2, H3} from "@components/elements/headers"
import {HtmlHTMLAttributes} from "react"
import {NodeStanfordNews, TermStanfordNewsTopic} from "@lib/gql/__generated__/drupal.d"
import {twMerge} from "tailwind-merge"

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  node: NodeStanfordNews
  headingLevel?: "h2" | "h3"
}

const StanfordNewsListItem = ({node, headingLevel, ...props}: Props) => {
  const image = node.suNewsFeaturedMedia?.mediaImage

  const topics: TermStanfordNewsTopic[] = node.suNewsTopics ? node.suNewsTopics.slice(0, 3) : []
  const Heading = headingLevel === "h3" ? H3 : H2

  const publishDate = node.suNewsPublishingDate
    ? new Date(node.suNewsPublishingDate.time).toLocaleDateString("en-us", {
        month: "long",
        day: "numeric",
        year: "numeric",
        timeZone: node.suNewsPublishingDate.timezone,
      })
    : undefined

  return (
    <article
      {...props}
      aria-labelledby={node.id}
      className={twMerge("@container", props.className)}
    >
      <div className="flex w-full flex-col justify-between py-10 @3xl:flex-row">
        <div className="@3xl::order-1 order-2">
          <div className="flex flex-col gap-10">
            <Heading
              className="order-last text-m2 font-bold"
              id={node.id}
            >
              <Link
                href={node.suNewsSource?.url || node.path}
                className="order-2 text-digital-red no-underline hocus:text-black hocus:underline"
              >
                {node.title}
              </Link>
            </Heading>

            {publishDate && <div>{publishDate}</div>}
          </div>

          {node.suNewsDek && <p>{node.suNewsDek}</p>}

          {topics && <div className="font-bold">{topics.map(topic => topic.name).join(", ")}</div>}
        </div>

        {image?.url && (
          <div className="relative order-1 mb-10 aspect-[16/9] shrink-0 @3xl:order-2 @3xl:mb-0 @3xl:w-1/4">
            <Image
              className="object-cover"
              src={image.url}
              alt={image.alt || ""}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 900px) 75vw, 1000px"
            />
          </div>
        )}
      </div>
    </article>
  )
}
export default StanfordNewsListItem
