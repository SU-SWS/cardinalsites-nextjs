import Paragraph from "@components/paragraphs/paragraph"
import {ParagraphUnion} from "@lib/gql/__generated__/drupal.d"
import {LayoutParagraphBehaviors} from "drupal"
import {clsx} from "clsx"
import twMerge from "@lib/utils/twMerge"
import {HTMLAttributes} from "react"

type Props = HTMLAttributes<HTMLDivElement> & {
  items: ParagraphUnion[]
  config?: LayoutParagraphBehaviors["config"]
}

const OneColumn = ({items, config, className, ...props}: Props) => {
  return (
    <div
      {...props}
      className={twMerge(
        className,
        clsx("mb-32 space-y-16 @container", {
          "px-5 pb-20 pt-20": !!config?.bg_color,
          "pt-0": config?.top_padding === "none",
          "pt-40": config?.top_padding === "more",
          "mb-0": config?.bottom_margin === "none",
          "pb-0": config?.bottom_padding === "none",
          "bg-foggy-light": config?.bg_color === "f4f4f4",
          "bg-[#ebeae4]": config?.bg_color === "ebeae5",
          "bg-[#dcecef]": config?.bg_color === "dcecef",
          "bg-[#dcefec]": config?.bg_color === "dcefec",
          "bg-[#f2e8f1]": config?.bg_color === "f2e8f1",
          "bg-[#f7ecde]": config?.bg_color === "f7ecde",
        })
      )}
      data-columns="1"
    >
      {items.map(item => (
        <Paragraph paragraph={item} key={item.uuid} />
      ))}
    </div>
  )
}
export default OneColumn
