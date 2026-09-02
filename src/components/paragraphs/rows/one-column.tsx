import Paragraph from "@components/paragraphs/paragraph"
import {ParagraphUnion} from "@lib/gql/__generated__/graphql"
import {LayoutParagraphBehaviors} from "drupal"
import cn from "@lib/utils/className"
import {HTMLAttributes} from "react"

type Props = HTMLAttributes<HTMLDivElement> & {
  items: ParagraphUnion[]
  config?: LayoutParagraphBehaviors["layout_paragraphs"]["config"]
}

const OneColumn = ({items, config, className, ...props}: Props) => {
  return (
    <div
      {...props}
      className={cn(
        "@container mb-64 space-y-16",
        {
          "px-20 py-40": !!config?.bg_color,
          "pt-0": config?.top_padding === "none",
          "pt-80": config?.top_padding === "more",
          "mb-0": config?.bottom_margin === "none",
          "pb-0": config?.bottom_padding === "none",
          "bg-fog-light": config?.bg_color === "f4f4f4",
          "bg-[#ebeae4]": config?.bg_color === "ebeae5",
          "bg-[#dcecef]": config?.bg_color === "dcecef",
          "bg-[#dcefec]": config?.bg_color === "dcefec",
          "bg-[#f2e8f1]": config?.bg_color === "f2e8f1",
          "bg-[#f7ecde]": config?.bg_color === "f7ecde",
        },
        className
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
