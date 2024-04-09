import Link from "@components/elements/link";
import {H2, H3} from "@components/elements/headers";
import {HtmlHTMLAttributes} from "react";
import {NodeStanfordPolicy} from "@lib/gql/__generated__/drupal.d";
import {twMerge} from "tailwind-merge";

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  node: NodeStanfordPolicy
  headingLevel?: "h2" | "h3"
}

const StanfordPolicyListItem = ({node, headingLevel, ...props}: Props) => {
  const Heading = headingLevel === "h3" ? H3 : H2;
  return (
    <article
      {...props}
      aria-labelledby={node.id}
      className={twMerge("max-w-[500px] w-full mx-auto shadow-xl border border-black-20 p-10", props.className)}
    >

      <Heading className="text-m2" id={node.id}>
        <Link href={node.path}>
          {node.title}
        </Link>
      </Heading>
    </article>
  )
}
export default StanfordPolicyListItem;