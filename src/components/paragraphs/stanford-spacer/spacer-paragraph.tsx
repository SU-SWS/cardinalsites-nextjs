import {HtmlHTMLAttributes} from "react"
import {ParagraphStanfordSpacer} from "@lib/gql/__generated__/drupal.d"
import {clsx} from "clsx"
import {twMerge} from "tailwind-merge"

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  paragraph: ParagraphStanfordSpacer
}

const SpacerParagraph = ({paragraph, ...props}: Props) => {
  return (
    <div
      className={twMerge(
        "h-20",
        clsx({
          "h-10": paragraph.suSpacerSize === "su-spacer-minimal",
          "h-15": paragraph.suSpacerSize === "su-spacer-reduced",
        })
      )}
      {...props}
    ></div>
  )
}
export default SpacerParagraph
