import Wysiwyg from "@components/elements/wysiwyg";
import {HtmlHTMLAttributes} from "react";
import {ParagraphStanfordWysiwyg} from "@lib/gql/__generated__/drupal.d";

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  paragraph: ParagraphStanfordWysiwyg
}

const WysiwygParagraph = ({paragraph, ...props}: Props) => {
  return <Wysiwyg html={paragraph.suWysiwygText?.processed} className="centered lg:max-w-[980px]" {...props}/>
}
export default WysiwygParagraph