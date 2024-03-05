import Wysiwyg from "@components/elements/wysiwyg";
import NodeCard from "@components/nodes/cards/node-card";
import Button from "@components/elements/button";
import {H2} from "@components/elements/headers";
import {HtmlHTMLAttributes} from "react";
import {ParagraphStanfordEntity} from "@lib/gql/__generated__/drupal.d";
import {twMerge} from "tailwind-merge";
import {getParagraphBehaviors} from "@components/paragraphs/get-paragraph-behaviors";

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  paragraph: ParagraphStanfordEntity
}

const EntityParagraph = async ({paragraph, ...props}: Props) => {
  const behaviors = getParagraphBehaviors(paragraph);
  const entities = paragraph.suEntityItem || [];
  const gridCols = [
    'lg:grid-cols-3',
    'lg:grid-cols-1',
    'lg:grid-cols-2',
  ];
  const gridClass = gridCols[entities.length >= 3 ? 0 : entities.length % 3]

  return (
    <div className="centered lg:max-w-[980px] flex flex-col gap-10 mb-20" {...props}>
      {paragraph.suEntityHeadline &&
        <H2 className={twMerge("text-center", behaviors.stanford_teaser?.hide_heading && "sr-only")}>
          {paragraph.suEntityHeadline}
        </H2>
      }

      <Wysiwyg html={paragraph.suEntityDescription?.processed}/>

      <div className={`grid ${gridClass} [&>*]:w-full gap-20 mb-20`}>
        {entities.map(entity =>
          <NodeCard key={entity.id} node={entity} headingLevel={paragraph.suEntityHeadline ? "h3" : "h2"}/>
        )}
      </div>

      {paragraph.suEntityButton?.url &&
        <div>
          <Button href={paragraph.suEntityButton.url} centered>
            {paragraph.suEntityButton.title}
          </Button>
        </div>
      }
    </div>
  )
}
export default EntityParagraph