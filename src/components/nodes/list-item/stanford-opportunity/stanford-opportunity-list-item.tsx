import Image from "next/image"
import Link from "@components/elements/link"
import {H2, H3} from "@components/elements/headers"
import {HtmlHTMLAttributes} from "react"
import {NodeStanfordOpportunity} from "@lib/gql/__generated__/graphql"
import cn from "@lib/utils/className"
import Wysiwyg from "@components/elements/wysiwyg"
import ReverseVisualOrder from "@components/elements/reverse-visual-order"
import {getIdFromText} from "@lib/utils/text-tools"

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  node: NodeStanfordOpportunity
  headingLevel?: "h2" | "h3"
}

const StanfordOpportunityListItem = ({node, headingLevel, ...props}: Props) => {
  const image = node.suOppImage?.mediaImage
  const Heading = headingLevel === "h3" ? H3 : H2
  const id = getIdFromText(node.title)
  return (
    <article {...props} aria-labelledby={id} className={cn("@container", props.className)}>
      <div className="flex w-full flex-col justify-between @3xl:flex-row">
        <div className="order-2 @3xl:order-1">
          <ReverseVisualOrder>
            <Heading className="font-bold" id={id}>
              <Link
                href={node.suOppSource?.url || node.path || "#"}
                className="order-2 text-digital-red no-underline hocus:text-black hocus:underline"
              >
                {node.title}
              </Link>
            </Heading>
            {node.suOppType && <div>{node.suOppType.map(type => type.name).join(", ")}</div>}
          </ReverseVisualOrder>

          <Wysiwyg html={node.suOppSummary?.processed || node.body?.summary} />

          {node.suOppCardFooter && (
            <footer>
              <Wysiwyg html={node.suOppCardFooter.processed} />
            </footer>
          )}
        </div>

        {image?.url && (
          <div className="order-1 w-full shrink-0 @3xl:w-1/4">
            <div className="relative mb-10 aspect-[16/9] @3xl:order-2 @3xl:mb-0">
              <Image
                className="ed11y-ignore object-cover"
                src={image.url}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 500px"
              />
            </div>
          </div>
        )}
      </div>
    </article>
  )
}
export default StanfordOpportunityListItem
