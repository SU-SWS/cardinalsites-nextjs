import Paragraph from "@components/paragraphs/paragraph";
import {ParagraphUnion} from "@lib/gql/__generated__/drupal.d";
import {isDraftMode} from "@lib/drupal/utils";

const OneColumn = ({items}: { items: ParagraphUnion[] }) => {
  const draftProps: Record<string, string> = {};
  if (isDraftMode()) {
    draftProps["data-columns"] = "1";
  }
  return (
    <div className="@container space-y-16" {...draftProps}>
      {items.map(item =>
        <Paragraph paragraph={item} key={item.id}/>
      )}
    </div>
  )
}
export default OneColumn;