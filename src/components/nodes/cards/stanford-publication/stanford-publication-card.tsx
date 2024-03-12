import Link from "@components/elements/link";
import {H2, H3} from "@components/elements/headers";
import {HtmlHTMLAttributes} from "react";
import {NodeStanfordPublication} from "@lib/gql/__generated__/drupal.d";
import ImageCard from "@components/patterns/image-card";

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  node: NodeStanfordPublication
  headingLevel?: "h2" | "h3"
}

const StanfordPublicationCard = ({node, headingLevel, ...props}: Props) => {
  const Heading = headingLevel === 'h3' ? H3 : H2;
  return (
    <ImageCard
      {...props}
      aria-labelledby={node.id}
      isArticle
    >

      <div className="flex flex-col">
        <Heading className="text-m2 order-last [&_a]:text-black [&_a]:hocus:text-digital-red" id={node.id}>
          <Link href={node.path}>
            {node.title}
          </Link>
        </Heading>
        <div className="font-bold order-first">
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
    </ImageCard>
  )
}
export default StanfordPublicationCard;