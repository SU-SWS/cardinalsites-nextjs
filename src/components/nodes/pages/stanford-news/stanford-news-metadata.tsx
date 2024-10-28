import {NodeStanfordNews, StanfordBasicSiteSetting} from "@lib/gql/__generated__/drupal.d"
import {getConfigPageField} from "@lib/gql/gql-queries"
import {getFirstText} from "@lib/utils/text-tools"

type Props = {
  node: NodeStanfordNews
}
const StanfordNewsMetadata = async ({node}: Props) => {
  const siteName =
    (await getConfigPageField<StanfordBasicSiteSetting, StanfordBasicSiteSetting["suSiteName"]>(
      "StanfordBasicSiteSetting",
      "suSiteName"
    )) || "Stanford University"

  const pageTitle = `${node.title} | ${siteName}`
  const description = node.suNewsDek || getFirstText(node.suNewsComponents)
  const image =
    node.suNewsFeaturedMedia?.mediaImage ||
    (node.suNewsBanner?.__typename === "MediaImage" && node.suNewsBanner.mediaImage)

  return (
    <>
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content="Stanford Sites User Guide" />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="article" />
      {node.suNewsPublishingDate?.time && (
        <meta property="article:published_time" content={new Date(node.suNewsPublishingDate.time).toISOString()} />
      )}

      {image && (
        <>
          <meta property="og:image" content={image.url} />
          <meta property="og:image:width" content={image.width.toString()} />
          <meta property="og:image:height" content={image.height.toString()} />
          {image.alt && <meta property="og:image:alt" content={image.alt} />}

          <meta name="twitter:image" content={image.url} />
          <meta name="twitter:image:width" content={image.width.toString()} />
          <meta name="twitter:image:height" content={image.height.toString()} />
          {image.alt && <meta name="twitter:image:alt" content={image.alt} />}
        </>
      )}

      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
    </>
  )
}
export default StanfordNewsMetadata
