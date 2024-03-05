import OneColumn from "@components/paragraphs/rows/one-column";
import {ParagraphUnion} from "@lib/gql/__generated__/drupal.d";
import {getParagraphBehaviors} from "@components/paragraphs/get-paragraph-behaviors";
import {isDraftMode} from "@lib/drupal/utils";

const TwoColumn = ({items, config}: { items: ParagraphUnion[], config?: Record<string, any> }) => {
  const leftItems = items.filter(item => getParagraphBehaviors(item).layout_paragraphs?.region === 'left');
  const rightItems = items.filter(item => getParagraphBehaviors(item).layout_paragraphs?.region !== 'left');

  let gridCols = 'md:grid-cols-2';
  if (config?.column_widths === '33-67') {
    gridCols = 'md:grid-cols-1-2';
  } else if (config?.column_widths === '67-33') {
    gridCols = 'md:grid-cols-2-1';
  }

  const draftProps: Record<string, string> = {};
  if (isDraftMode()) {
    draftProps["data-columns"] = "2";
  }

  return (
    <div className={`gutters grid ${gridCols} gap-10 md:gap-20`} {...draftProps}>
      <OneColumn items={leftItems}/>
      <OneColumn items={rightItems}/>
    </div>
  )
}
export default TwoColumn;