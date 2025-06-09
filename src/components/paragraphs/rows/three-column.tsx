import OneColumn from "@components/paragraphs/rows/one-column"
import {ParagraphUnion} from "@lib/gql/__generated__/drupal.d"
import {getParagraphBehaviors} from "@components/paragraphs/get-paragraph-behaviors"
import {LayoutParagraphBehaviors} from "@lib/drupal/drupal-jsonapi.d"
import {clsx} from "clsx"
import twMerge from "@lib/utils/twMerge"

type Props = {
  items: ParagraphUnion[]
  config?: LayoutParagraphBehaviors["config"]
}

const ThreeColumn = ({items, config}: Props) => {
  const leftItems = items.filter(item => getParagraphBehaviors(item).layout_paragraphs?.region === "left")
  const mainItems = items.filter(
    item => !["left", "right"].includes(getParagraphBehaviors(item).layout_paragraphs?.region || "main")
  )
  const rightItems = items.filter(item => getParagraphBehaviors(item).layout_paragraphs?.region === "right")
  return (
    <div
      className={twMerge(
        clsx("gutters mb-32 grid gap-10 @10xl:grid-cols-3 @10xl:gap-20", {
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
      data-columns="3"
    >
      <OneColumn items={leftItems} config={{top_padding: "none", bottom_margin: "none"}} />
      <OneColumn items={mainItems} config={{top_padding: "none", bottom_margin: "none"}} />
      <OneColumn items={rightItems} config={{top_padding: "none", bottom_margin: "none"}} />
    </div>
  )
}
export default ThreeColumn
