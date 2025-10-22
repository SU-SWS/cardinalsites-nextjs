import {HtmlHTMLAttributes} from "react"
import {ParagraphStanfordFaq} from "@lib/gql/__generated__/drupal.d"
import {H2, H3, H4} from "@components/elements/headers"
import Wysiwyg from "@components/elements/wysiwyg"
import Accordion, {AccordionHeaderChoice} from "@components/elements/accordion"
import twMerge from "@lib/utils/twMerge"
import ExpandCollapseAll from "@components/paragraphs/stanford-faq/expand-collapse-all"
import {getParagraphBehaviors} from "@components/paragraphs/get-paragraph-behaviors"
import {FAQParagraphBehaviors} from "drupal"

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  paragraph: ParagraphStanfordFaq
}

const FaqParagraph = ({paragraph, ...props}: Props) => {
  const behaviors = getParagraphBehaviors<FAQParagraphBehaviors>(paragraph)
  const headerTag = behaviors.faq_accordions?.heading || "h2"

  let Header = H2
  if (headerTag === "h3") Header = H3
  if (headerTag == "h4") Header = H4

  const heading = paragraph.suFaqHeadline

  let accordionHeadingLevel: AccordionHeaderChoice = "h2"
  if (heading) {
    if (headerTag === "h2") accordionHeadingLevel = "h3"
    if (headerTag === "h3") accordionHeadingLevel = "h4"
    if (headerTag === "h4") accordionHeadingLevel = "h5"
  }

  return (
    <div {...props} className={twMerge("space-y-20", props.className)}>
      <div className="flex flex-col items-center justify-between gap-20 @3xl:flex-row">
        {heading && (
          <Header id={paragraph.uuid} className="mb-0">
            {heading}
          </Header>
        )}

        <ExpandCollapseAll className="ml-auto" />
      </div>
      <Wysiwyg html={paragraph.suFaqDescription?.processed} />

      <div>
        {paragraph.suFaqQuestions?.map(question => (
          <Accordion
            className="border-t border-black-40 last:border-b"
            buttonProps={{className: "mt-6"}}
            key={question.uuid}
            button={question.suAccordionTitle}
            headingLevel={accordionHeadingLevel}
          >
            <Wysiwyg html={question.suAccordionBody.processed} />
          </Accordion>
        ))}
      </div>
    </div>
  )
}

export default FaqParagraph
