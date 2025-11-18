import {getConfigPageField} from "@lib/gql/gql-queries"
import {
  MetaTagUnion,
  MetaTagValue as MetaTagValueType,
  MetaTagProperty as MetaTagPropertyType,
  StanfordBasicSiteSetting,
  Maybe,
} from "@lib/gql/__generated__/drupal.d"
import {JSX} from "react"

type Props = {
  /**
   * Page title without the site name, undefined if the home page.
   */
  pageTitle?: string
  /**
   * Metatag field data.
   */
  metatags?: MetaTagUnion[]
  /**
   * If no description metatag is provided by the backend, use this.
   */
  backupDescription?: Maybe<string>
  /**
   * Additional meta data if desired.
   */
  children?: JSX.Element | JSX.Element[]
}

const NodePageMetadata = async ({pageTitle, metatags, backupDescription, children}: Props) => {
  const siteName =
    (await getConfigPageField<StanfordBasicSiteSetting, StanfordBasicSiteSetting["suSiteName"]>(
      "StanfordBasicSiteSetting",
      "suSiteName"
    )) || "Stanford University"

  const title = pageTitle ? `${pageTitle} | ${siteName}` : siteName

  const hasDescription = metatags?.some(
    tag => tag.__typename === "MetaTagValue" && tag.attributes.name === "description"
  )

  return (
    <>
      <title>{title}</title>
      <meta property="og:title" content={title} />
      <meta name="twitter:title" content={title} />

      {!hasDescription && backupDescription && (
        <>
          <meta name="description" content={backupDescription} />
          <meta name="twitter:description" content={backupDescription} />
          <meta property="og:description" content={backupDescription} />
        </>
      )}

      {metatags?.map((tag, i) => (
        <MetaTag key={`metatag-${i}`} tag={tag} />
      ))}

      {children}
    </>
  )
}

const MetaTag = ({tag}: {tag: MetaTagUnion}) => {
  if (tag.__typename === "MetaTagValue") return <MetaTagValue tag={tag} />
  if (tag.__typename === "MetaTagProperty") return <MetaTagProperty tag={tag} />
}

const MetaTagValue = ({tag}: {tag: MetaTagValueType}) => {
  const ignoreNames = ["title", "twitter:title"]
  if (tag.attributes.name && tag.attributes.content && !ignoreNames.includes(tag.attributes.name))
    return <meta name={tag.attributes.name} content={tag.attributes.content} />
}

const MetaTagProperty = ({tag}: {tag: MetaTagPropertyType}) => {
  const ignoreProperties = ["og:url", "og:title"]
  if (tag.attributes.property && tag.attributes.content && !ignoreProperties.includes(tag.attributes.property))
    return <meta property={tag.attributes.property} content={tag.attributes.content} />
}

export default NodePageMetadata
