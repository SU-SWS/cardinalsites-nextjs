import Image from "next/image"
import Link from "@components/elements/link"
import {H2, H3} from "@components/elements/headers"
import {HtmlHTMLAttributes} from "react"
import {NodeStanfordPerson} from "@lib/gql/__generated__/drupal.d"
import {twMerge} from "tailwind-merge"

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  node: NodeStanfordPerson
  headingLevel?: "h2" | "h3"
}

const StanfordPersonListItem = ({node, headingLevel, ...props}: Props) => {
  const imageUrl = node.suPersonPhoto?.mediaImage.url

  const Heading = headingLevel === "h3" ? H3 : H2
  return (
    <article
      {...props}
      aria-labelledby={node.id}
      className={twMerge("mx-auto w-full max-w-[500px] p-20 text-center shadow-lg", props.className)}
    >
      {imageUrl && (
        <div className="relative mx-auto mb-20 aspect-[1/1] w-full">
          <Image
            className="rounded-full object-cover"
            src={imageUrl}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 900px) 75vw, 1000px"
          />
        </div>
      )}

      <Heading
        className="text-m2"
        id={node.id}
      >
        <Link href={node.path}>{node.title}</Link>
      </Heading>

      {node.suPersonFullTitle && <div>{node.suPersonFullTitle}</div>}
    </article>
  )
}
export default StanfordPersonListItem
