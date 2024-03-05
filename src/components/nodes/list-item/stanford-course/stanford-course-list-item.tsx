import Link from "@components/elements/link";
import {H2, H3} from "@components/elements/headers";
import {HtmlHTMLAttributes} from "react";
import {NodeStanfordCourse} from "@lib/gql/__generated__/drupal.d";

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  node: NodeStanfordCourse
  headingLevel?: "h2" | "h3"
}

const StanfordCourseListItem = ({node, headingLevel, ...props}: Props) => {
  const Heading = headingLevel === 'h3' ? H3 : H2;
  return (
    <article aria-labelledby={node.id} {...props}>
      <Heading className="text-m2" id={node.id}>
        <Link href={node.path}>
          {node.title}
        </Link>
      </Heading>
      {node.suCourseInstructors &&
        <div>
          <span className="font-bold">Instructor{node.suCourseInstructors.length > 1 ? "s" : ""}: </span>
          {node.suCourseInstructors.map((instructor, i) =>
            <span key={`${node.id}-instructor-${i}`}>{instructor}</span>
          )}
        </div>

      }
    </article>
  )
}
export default StanfordCourseListItem;