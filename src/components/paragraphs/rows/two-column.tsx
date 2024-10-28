import OneColumn from "@components/paragraphs/rows/one-column"
import {ParagraphUnion} from "@lib/gql/__generated__/drupal.d"
import {getParagraphBehaviors} from "@components/paragraphs/get-paragraph-behaviors"
import {isPreviewMode} from "@lib/drupal/is-preview-mode"
import twMerge from "@lib/utils/twMerge"
import {clsx} from "clsx"

export type TwoColumnConfig = Record<string, string>
type Props = {
  items: ParagraphUnion[]
  config?: TwoColumnConfig
}
const TwoColumn = ({items, config}: Props) => {
  const leftItems = items.filter(item => getParagraphBehaviors(item).layout_paragraphs?.region === "left")
  const rightItems = items.filter(item => getParagraphBehaviors(item).layout_paragraphs?.region !== "left")

  const draftProps: Record<string, string> = {}
  if (isPreviewMode()) {
    draftProps["data-columns"] = "2"
  }

  return (
    <div
      className={twMerge(
        "gutters grid gap-10 @7xl:grid-cols-2 @7xl:gap-20",
        clsx({
          "@7xl:grid-cols-1-2": config?.column_widths === "33-67",
          "@7xl:grid-cols-2-1": config?.column_widths === "67-33",
        })
      )}
      {...draftProps}
    >
      <OneColumn items={leftItems} />
      <OneColumn items={rightItems} />
    </div>
  )
}
export default TwoColumn
