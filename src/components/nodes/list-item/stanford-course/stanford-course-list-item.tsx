import Link from "@components/elements/link"
import {H2, H3} from "@components/elements/headers"
import {HtmlHTMLAttributes} from "react"
import {NodeStanfordCourse} from "@lib/gql/__generated__/drupal.d"

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  node: NodeStanfordCourse
  headingLevel?: "h2" | "h3"
}

const StanfordCourseListItem = ({node, headingLevel, ...props}: Props) => {
  const Heading = headingLevel === "h3" ? H3 : H2
  const body = node.body?.processed
    .replace(/<\/?[^>]+(>|$)/g, " ")
    .replace(/ +/, " ")
    .replace("&nbsp;", " ")
    .split(" ")

  return (
    <article {...props} aria-labelledby={node.id}>
      <div className="flex flex-col">
        <Heading className="order-last text-m2" id={node.id}>
          <Link href={node.path}>{node.title}</Link>
        </Heading>

        <div>
          {(node.suCourseSubject?.name || node.suCourseCode) && (
            <strong>
              {node.suCourseSubject?.name}
              {node.suCourseCode}
            </strong>
          )}
          {(node.suCourseSubject || node.suCourseCode) && (node.suCourseQuarters || node.suCourseAcademicYear) && (
            <>&nbsp;|&nbsp;</>
          )}
          {node.suCourseAcademicYear} {node.suCourseQuarters?.map(quarter => quarter.name).join(", ")}
        </div>
      </div>

      {node.suCourseInstructors && (
        <div>
          <span className="font-bold">Instructor{node.suCourseInstructors.length > 1 ? "s" : ""}: </span>
          {node.suCourseInstructors.join(",")}
        </div>
      )}

      {body && (
        <p>
          {body.slice(0, 50).join(" ")}
          {body.length > 50 && <>&hellip;</>}
        </p>
      )}
    </article>
  )
}
export default StanfordCourseListItem
