import Wysiwyg from "@components/elements/wysiwyg"
import NodeCard from "@components/nodes/cards/node-card"
import Button from "@components/elements/button"
import {H2} from "@components/elements/headers"
import {ElementType, HtmlHTMLAttributes, Suspense} from "react"
import {ParagraphStanfordEntity} from "@lib/gql/__generated__/graphql"
import twMerge from "@lib/utils/twMerge"
import {getParagraphBehaviors} from "@components/paragraphs/get-paragraph-behaviors"
import {getEntityFromPath} from "@lib/gql/gql-queries"
import {TeaserParagraphBehaviors} from "drupal"
import {clsx} from "clsx"
import {getIdFromText} from "@lib/utils/text-tools"
import {cacheTag} from "next/cache"

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  paragraph: ParagraphStanfordEntity
}

const EntityParagraph = async ({paragraph, ...props}: Props) => {
  const behaviors = getParagraphBehaviors<TeaserParagraphBehaviors>(paragraph)

  const EntityWrapper: ElementType =
    paragraph.suEntityHeadline && behaviors.stanford_teaser?.heading_behavior !== "remove" ? "section" : "div"

  const id = getIdFromText(paragraph.suEntityHeadline)

  return (
    <EntityWrapper
      {...props}
      className={twMerge("centered mb-20 flex flex-col gap-10", props.className)}
      aria-labelledby={EntityWrapper === "section" ? id : undefined}
    >
      {paragraph.suEntityHeadline && behaviors.stanford_teaser?.heading_behavior !== "remove" && (
        <H2
          id={id}
          className={twMerge(
            "mb-0 text-center",
            clsx({"sr-only": behaviors.stanford_teaser?.heading_behavior === "hide"})
          )}
        >
          {paragraph.suEntityHeadline}
        </H2>
      )}

      <Wysiwyg html={paragraph.suEntityDescription?.processed} />

      {!!paragraph.suEntityItem?.length && (
        <div
          className={twMerge(
            "mb-20 grid gap-20 [&>*]:w-full",
            clsx({
              "@5xl:grid-cols-2": paragraph.suEntityItem.length === 2,
              "@8xl:grid-cols-3": paragraph.suEntityItem.length >= 3,
            })
          )}
        >
          {paragraph.suEntityItem.map((entity, i) => (
            <Suspense key={`${paragraph.id}-${i}`}>
              <EntityTeaser entityPath={entity?.path || ""} headingLevel={paragraph.suEntityHeadline ? "h3" : "h2"} />
            </Suspense>
          ))}
        </div>
      )}

      {paragraph.suEntityButton?.url && (
        <Button href={paragraph.suEntityButton.url} centered>
          {paragraph.suEntityButton.title || paragraph.suEntityButton.url}
        </Button>
      )}
    </EntityWrapper>
  )
}

const EntityTeaser = async ({entityPath, headingLevel = "h2"}: {entityPath: string; headingLevel?: "h2" | "h3"}) => {
  "use cache: remote"
  cacheTag(`paths:${entityPath}`)
  const {entity} = await getEntityFromPath(entityPath, false, true)
  if (!entity) return null
  return <NodeCard node={entity} headingLevel={headingLevel} />
}

export default EntityParagraph
