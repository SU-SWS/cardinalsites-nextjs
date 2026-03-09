import {redirect} from "next/navigation"
import Wysiwyg from "@components/elements/wysiwyg"
import {H1} from "@components/elements/headers"
import {HtmlHTMLAttributes} from "react"
import {NodeStanfordCourse} from "@lib/gql/__generated__/graphql"
import NodePageMetadata from "@components/nodes/pages/node-page-metadata"
import {getCleanDescription} from "@lib/utils/text-tools"

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  node: NodeStanfordCourse
}

const StanfordCoursePage = ({node, ...props}: Props) => {
  if (node.suCourseLink?.url) redirect(node.suCourseLink?.url)
  return (
    <article className="centered my-32" {...props}>
      <NodePageMetadata
        pageTitle={node.title}
        metatags={node.metatag}
        backupDescription={getCleanDescription(node.body?.processed)}
      />
      <H1>{node.title}</H1>
      <div className="flex flex-col gap-10">
        {node.suCourseSubject && <div>{node.suCourseSubject.name}</div>}

        {node.suCourseCode && <div>{node.suCourseCode}</div>}

        <Wysiwyg html={node.body?.processed} />

        {node.suCourseTags && (
          <div>
            {node.suCourseTags.map(tag => (
              <div key={tag.uuid}>{tag.name}</div>
            ))}
          </div>
        )}

        {node.suCourseQuarters && (
          <div>
            {node.suCourseQuarters.map(quarter => (
              <div key={quarter.uuid}>{quarter.name}</div>
            ))}
          </div>
        )}

        {node.suCourseInstructors && (
          <div>
            {node.suCourseInstructors.map((instructor, i) => (
              <div key={`instructor-${i}`}>{instructor}</div>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}
export default StanfordCoursePage
