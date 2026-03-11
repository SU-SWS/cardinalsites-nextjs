import OneColumn from "@components/paragraphs/rows/one-column"
import {ParagraphUnion} from "@lib/gql/__generated__/graphql"
import {getParagraphBehaviors} from "@components/paragraphs/get-paragraph-behaviors"
import twMerge from "@lib/utils/twMerge"
import {clsx} from "clsx"
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
      className={twMerge(
        "mb-32",
        clsx({
          gutters: !config?.bg_color,
          "px-10 py-20": !!config?.bg_color,
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
      data-columns="2"
    >
      <div
        className={twMerge(
          "centered grid gap-10 @6xl:grid-cols-2 @6xl:gap-20",
          clsx({
            "@6xl:grid-cols-1-2": config?.column_widths === "33-67",
            "@6xl:grid-cols-2-1": config?.column_widths === "67-33",
          })
        )}
      >
        <OneColumn
          items={leftItems}
          config={{top_padding: "none", bottom_margin: "none"}}
          className={clsx({
            "after:contents('') relative after:absolute after:-right-10 after:top-0 after:h-full after:w-[1px] after:bg-black":
              config?.vertical_dividers,
          })}
        />
        <OneColumn items={rightItems} config={{top_padding: "none", bottom_margin: "none"}} />
      </div>
    </div>
  )
}
export default TwoColumn
