import {NodeStanfordCourse, StanfordBasicSiteSetting} from "@lib/gql/__generated__/drupal.d"
import {getConfigPageField} from "@lib/gql/gql-queries"
import {getCleanDescription} from "@lib/utils/text-tools"

type Props = {
  node: NodeStanfordCourse
}
const StanfordCourseMetadata = async ({node}: Props) => {
  const siteName =
    (await getConfigPageField<StanfordBasicSiteSetting, StanfordBasicSiteSetting["suSiteName"]>(
      "StanfordBasicSiteSetting",
      "suSiteName"
    )) || "Stanford University"

  const pageTitle = `${node.title} | ${siteName}`
  const description = getCleanDescription(node.body?.processed)

  return (
    <>
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content="Stanford Sites User Guide" />
      <meta property="og:description" content={description} />

      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
    </>
  )
}
export default StanfordCourseMetadata
