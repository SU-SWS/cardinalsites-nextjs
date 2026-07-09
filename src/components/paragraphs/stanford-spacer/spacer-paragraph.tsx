import {HtmlHTMLAttributes} from "react"
import {ParagraphStanfordSpacer} from "@lib/gql/__generated__/graphql"
import cn from "@lib/utils/className"

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  paragraph: ParagraphStanfordSpacer
}

const SpacerParagraph = ({paragraph, ...props}: Props) => {
  return (
    <div
      className={cn("h-20", {
        "h-10": paragraph.suSpacerSize === "su-spacer-minimal",
        "h-15": paragraph.suSpacerSize === "su-spacer-reduced",
      })}
      {...props}
    ></div>
  )
}
export default SpacerParagraph
