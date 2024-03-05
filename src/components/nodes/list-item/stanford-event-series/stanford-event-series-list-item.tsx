import Link from "@components/elements/link";
import {H2, H3} from "@components/elements/headers";
import {HtmlHTMLAttributes} from "react";
import {NodeStanfordEventSeries} from "@lib/gql/__generated__/drupal.d";

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  node: NodeStanfordEventSeries
  headingLevel?: "h2" | "h3"
}

const StanfordEventSeriesListItem = ({node, headingLevel, ...props}: Props) => {
  const Heading = headingLevel === 'h3' ? H3 : H2;
  return (
    <article aria-labelledby={node.id}
             className="max-w-[500px] w-full mx-auto shadow-xl border border-black-20 p-10" {...props}>

      <Heading className="text-m2" id={node.id}>
        <Link href={node.path}>
          {node.title}
        </Link>
      </Heading>
    </article>
  )
}
export default StanfordEventSeriesListItem;