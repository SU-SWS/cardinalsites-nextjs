import Image from "next/image"
import Link from "@components/elements/link"
import {H2, H3} from "@components/elements/headers"
import {HtmlHTMLAttributes} from "react"
import {NodeStanfordPerson} from "@lib/gql/__generated__/drupal.d"
import twMerge from "@lib/utils/twMerge"

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  node: NodeStanfordPerson
  headingLevel?: "h2" | "h3"
}

const StanfordPersonCard = ({node, headingLevel, ...props}: Props) => {
  const imageUrl = node.suPersonPhoto?.mediaImage.url

  const Heading = headingLevel === "h3" ? H3 : H2
  return (
    <article
      {...props}
      aria-labelledby={node.id}
      className={twMerge("mx-auto overflow-hidden text-center", props.className)}
    >
      {imageUrl && (
        <div className="relative mx-auto mb-20 aspect-[1/1] w-3/5">
          <Image
            className="ed11y-ignore rounded-full object-cover"
            src={imageUrl}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 900px) 75vw, 1000px"
          />
        </div>
      )}

      <Heading id={node.id}>
        <Link href={node.path}>{node.title}</Link>
      </Heading>

      {node.suPersonShortTitle && <div>{node.suPersonShortTitle}</div>}
    </article>
  )
}
export default StanfordPersonCard
