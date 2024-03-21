import Link from "@components/elements/link";
import {H2, H3} from "@components/elements/headers";
import {HtmlHTMLAttributes} from "react";
import {NodeStanfordPublication} from "@lib/gql/__generated__/drupal.d";
import {twMerge} from "tailwind-merge";

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  node: NodeStanfordPublication
  headingLevel?: "h2" | "h3"
}

const StanfordPublicationListItem = ({node, headingLevel, ...props}: Props) => {
  const citationUrl = node.suPublicationCitation?.suUrl?.url;
  const Heading = headingLevel === 'h3' ? H3 : H2;
  return (
    <article
      {...props}
      aria-labelledby={node.id}
      className={twMerge("max-w-[500px] w-full mx-auto shadow-xl border border-black-20 p-10", props.className)}
    >
      <div className="flex flex-col">
        <Heading className="text-m2 order-first" id={node.id}>
          <Link href={citationUrl || node.path}>
            {node.title}
          </Link>
        </Heading>
        <div className="font-bold">
          Publication
        </div>
      </div>

      {node.suPublicationTopics &&
        <div>
          {node.suPublicationTopics.map(topic =>
            <div key={topic.id}>{topic.name}</div>
          )}
        </div>
      }
    </article>
  )
}
export default StanfordPublicationListItem;