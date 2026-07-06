import Wysiwyg from "@components/elements/wysiwyg"
import Button from "@components/elements/button"
import View, {loadViewPage} from "@components/views/view"
import {H2} from "@components/elements/headers"
import {ElementType, HtmlHTMLAttributes} from "react"
import {ParagraphStanfordList} from "@lib/gql/__generated__/graphql"
import {getParagraphBehaviors} from "@components/paragraphs/get-paragraph-behaviors"
import twMerge from "@lib/utils/twMerge"
import {ListParagraphBehaviors} from "drupal"
import {getViewPagedItems, VIEW_PAGE_SIZE} from "@lib/gql/gql-views"
import {getIdFromText} from "@lib/utils/text-tools"

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  paragraph: ParagraphStanfordList
}

const ListParagraph = async ({paragraph, ...props}: Props) => {
  const behaviors = getParagraphBehaviors<ListParagraphBehaviors>(paragraph)
  const viewId = paragraph.suListView?.view || ""
  const displayId = paragraph.suListView?.display || ""
  const limit = paragraph.suListView?.pageSize || VIEW_PAGE_SIZE

  const pagedItems =
    viewId && displayId
      ? await getViewPagedItems(viewId, displayId, limit, paragraph.suListView?.contextualFilter)
      : {items: [], totalItems: 0}

  const {totalItems} = pagedItems
  const viewItems = (limit || 3) < VIEW_PAGE_SIZE ? pagedItems.items.slice(0, limit) : pagedItems.items

  const addLoadMore = (limit || 3) >= VIEW_PAGE_SIZE && totalItems > viewItems.length

  if (behaviors.list_paragraph?.hide_empty && viewItems.length === 0) return null

  const ListWrapper: ElementType =
    paragraph.suListHeadline && behaviors.list_paragraph?.heading_behavior !== "remove" ? "section" : "div"
  const id = getIdFromText(paragraph.suListHeadline)

  return (
    <ListWrapper
      {...props}
      className={twMerge("centered mb-20 flex flex-col gap-10 xl:max-w-[1200px]", props.className)}
      aria-labelledby={ListWrapper === "section" ? id : undefined}
      data-nosnippet
    >
      {paragraph.suListHeadline && behaviors.list_paragraph?.heading_behavior !== "remove" && (
        <H2
          id={id}
          className={twMerge("text-center", behaviors.list_paragraph?.heading_behavior === "hide" && "sr-only")}
        >
          {paragraph.suListHeadline}
        </H2>
      )}

      <Wysiwyg html={paragraph.suListDescription?.processed} />

      {viewId && displayId && viewItems && (
        <View
          viewId={viewId}
          displayId={displayId}
          items={viewItems}
          headingLevel={paragraph.suListHeadline ? "h3" : "h2"}
          loadPage={
            addLoadMore
              ? loadViewPage.bind(
                  null,
                  viewId,
                  displayId,
                  !!paragraph.suListHeadline,
                  VIEW_PAGE_SIZE,
                  paragraph.suListView?.contextualFilter || []
                )
              : undefined
          }
          totalItems={totalItems}
        />
      )}

      {viewItems.length === 0 && behaviors.list_paragraph?.empty_message && (
        <p>{behaviors.list_paragraph.empty_message}</p>
      )}

      {paragraph.suListButton?.url && (
        <Button centered href={paragraph.suListButton.url}>
          {paragraph.suListButton.title}
        </Button>
      )}
    </ListWrapper>
  )
}

export default ListParagraph
