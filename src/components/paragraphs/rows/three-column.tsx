import OneColumn from "@components/paragraphs/rows/one-column";
import {ParagraphUnion} from "@lib/gql/__generated__/drupal.d";
import {getParagraphBehaviors} from "@components/paragraphs/get-paragraph-behaviors";
import {isDraftMode} from "@lib/drupal/utils";

const ThreeColumn = ({items}: { items: ParagraphUnion[] }) => {
  const leftItems = items.filter(item => getParagraphBehaviors(item).layout_paragraphs?.region === 'left');
  const mainItems = items.filter(item => !["left", "right"].includes(getParagraphBehaviors(item).layout_paragraphs?.region || "main"));
  const rightItems = items.filter(item => getParagraphBehaviors(item).layout_paragraphs?.region === 'right');

  const draftProps: Record<string, string> = {};
  if (isDraftMode()) {
    draftProps["data-columns"] = "3";
  }

  return (
    <div className="gutters grid md:grid-cols-3 gap-10 md:gap-20" {...draftProps}>
      <OneColumn items={leftItems}/>
      <OneColumn items={mainItems}/>
      <OneColumn items={rightItems}/>
    </div>
  )
}
export default ThreeColumn;