import OneColumn from "@components/paragraphs/rows/one-column"
import {ParagraphUnion} from "@lib/gql/__generated__/graphql"
import {getParagraphBehaviors} from "@components/paragraphs/get-paragraph-behaviors"
import cn from "@lib/utils/className"
import {LayoutParagraphBehaviors} from "drupal"

export type TwoColumnConfig = LayoutParagraphBehaviors["layout_paragraphs"]["config"] & {
  column_widths: "33-67" | "67-33"
}
type Props = {
  items: ParagraphUnion[]
  config?: LayoutParagraphBehaviors["layout_paragraphs"]["config"] & {
    column_widths: "33-67" | "67-33"
    vertical_dividers?: boolean
  }
}
const TwoColumn = ({items, config}: Props) => {
  const leftItems = items.filter(item => getParagraphBehaviors(item).layout_paragraphs?.region === "left")
  const rightItems = items.filter(item => getParagraphBehaviors(item).layout_paragraphs?.region !== "left")

  return (
    <div
      className={cn("mb-64", {
        gutters: !config?.bg_color,
        "px-40 py-40": !!config?.bg_color,
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
      })}
      data-columns="2"
    >
      <div
        className={cn("centered grid gap-20 @6xl:grid-cols-2 @6xl:gap-40", {
          "@6xl:grid-cols-1-2": config?.column_widths === "33-67",
          "@6xl:grid-cols-2-1": config?.column_widths === "67-33",
        })}
      >
        <OneColumn
          items={leftItems}
          config={{top_padding: "none", bottom_margin: "none"}}
          className={cn({
            "after:contents('') relative after:absolute after:top-0 after:-right-10 after:h-full after:w-1 after:bg-black":
              config?.vertical_dividers,
          })}
        />
        <OneColumn items={rightItems} config={{top_padding: "none", bottom_margin: "none"}} />
      </div>
    </div>
  )
}
export default TwoColumn
