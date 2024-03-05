import Image from "next/image";
import Link from "@components/elements/link";
import {H2, H3} from "@components/elements/headers";
import {HtmlHTMLAttributes} from "react";
import {NodeStanfordNews} from "@lib/gql/__generated__/drupal.d";

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  node: NodeStanfordNews
  headingLevel?: "h2" | "h3"
}

const StanfordNewsCard = ({node, headingLevel, ...props}: Props) => {
  const image = node.suNewsFeaturedMedia?.mediaImage

  const topics = node.suNewsTopics?.slice(0, 3) || [];
  const Heading = headingLevel === 'h3' ? H3 : H2;

  const publishDate = node.suNewsPublishingDate?.time ? new Date(node.suNewsPublishingDate.time).toLocaleDateString("en-us", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: node.suNewsPublishingDate.timezone
  }) : undefined;

  return (
    <article aria-labelledby={node.id} className="mx-auto shadow-xl border border-black-20 overflow-hidden" {...props}>

      {image?.url &&
        <div className="relative aspect-[16/9] w-full">
          <Image
            className="object-cover"
            src={image.url}
            alt={image.alt || ''}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 900px) 75vw, 1000px"
          />
        </div>
      }
      <div className="p-20">

        <div className="flex flex-col">
        <Heading className="text-m2 [&_a]:text-black" id={node.id}>
          <Link href={node.suNewsSource?.url || node.path}>
            {node.title}
          </Link>
        </Heading>

        {publishDate &&
          <div className="order-first">
            {publishDate}
          </div>
        }
        </div>

        {topics &&
          <div>
            {topics.map(topic => topic.name).join(', ')}
          </div>
        }

      </div>
    </article>
  )
}
export default StanfordNewsCard;