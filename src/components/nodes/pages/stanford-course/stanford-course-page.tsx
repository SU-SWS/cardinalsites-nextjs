import {redirect} from "next/navigation";
import Wysiwyg from "@components/elements/wysiwyg";
import {H1} from "@components/elements/headers";
import {HtmlHTMLAttributes} from "react";
import {NodeStanfordCourse} from "@lib/gql/__generated__/drupal.d";
import {isDraftMode} from "@lib/drupal/utils";

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  node: NodeStanfordCourse
  headingLevel?: "h2" | "h3"
}

const StanfordCoursePage = ({node, ...props}: Props) => {
  if (node.suCourseLink?.url && !isDraftMode()) redirect(node.suCourseLink?.url);
  return (
    <article className="centered my-32" {...props}>
      <H1>
        {node.title}
      </H1>
      <div className="flex flex-col gap-10">
        {node.suCourseSubject &&
          <div>{node.suCourseSubject.name}</div>
        }

        {node.suCourseCode &&
          <div>{node.suCourseCode}</div>
        }

        <Wysiwyg html={node.body?.processed}/>

        {node.suCourseTags &&
          <div>
            {node.suCourseTags.map(tag =>
              <div key={tag.id}>{tag.name}</div>
            )}
          </div>
        }

        {node.suCourseQuarters &&
          <div>
            {node.suCourseQuarters.map(quarter =>
              <div key={quarter.id}>{quarter.name}</div>
            )}
          </div>
        }

        {node.suCourseInstructors &&
          <div>
            {node.suCourseInstructors.map((instructor, i) =>
              <div key={`instructor-${i}`}>{instructor}</div>
            )}
          </div>
        }
      </div>
    </article>
  )
}
export default StanfordCoursePage;