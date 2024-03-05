import {HtmlHTMLAttributes} from "react";
import {ParagraphStanfordSpacer} from "@lib/gql/__generated__/drupal.d";

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  paragraph: ParagraphStanfordSpacer
}

const SpacerParagraph = ({paragraph, ...props}: Props) => {
  let h = 'h-20';
  if (paragraph.suSpacerSize === 'su-spacer-minimal') h = 'h-10'
  if (paragraph.suSpacerSize === 'su-spacer-reduced') h = 'h-15'
  return (
    <div className={h} {...props}></div>
  )
}
export default SpacerParagraph