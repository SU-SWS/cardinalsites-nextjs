import Link from "@components/elements/link"
import {H2, H3} from "@components/elements/headers"
import {HtmlHTMLAttributes} from "react"
import {NodeStanfordCourse} from "@lib/gql/__generated__/drupal.d"
import ImageCard from "@components/patterns/image-card"

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  node: NodeStanfordCourse
  headingLevel?: "h2" | "h3"
}

const StanfordCourseCard = ({node, headingLevel, ...props}: Props) => {
  const Heading = headingLevel === "h3" ? H3 : H2
  return (
    <ImageCard {...props} aria-labelledby={node.id} isArticle>
      <Heading className="order-last text-m2" id={node.id}>
        <Link href={node.path}>{node.title}</Link>
      </Heading>
      <div className="order-first flex gap-5">
        {node.suCourseSubject && (
          <div className="font-bold">
            {node.suCourseSubject.name}
            {node.suCourseCode}
          </div>
        )}
        {node.suCourseSubject && node.suCourseAcademicYear && <> | </>}
        <div>{node.suCourseAcademicYear}</div>
      </div>
    </ImageCard>
  )
}
export default StanfordCourseCard
