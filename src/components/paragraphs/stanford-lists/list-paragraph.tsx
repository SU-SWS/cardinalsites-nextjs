import Wysiwyg from "@components/elements/wysiwyg"
import Button from "@components/elements/button"
import View from "@components/views/view"
import {H2} from "@components/elements/headers"
import {ElementType, HtmlHTMLAttributes, Suspense} from "react"
import {ParagraphStanfordList} from "@lib/gql/__generated__/drupal.d"
import {getParagraphBehaviors} from "@components/paragraphs/get-paragraph-behaviors"
import twMerge from "@lib/utils/twMerge"
import {ListParagraphBehaviors} from "@lib/drupal/drupal-jsonapi.d"
import {getViewPagedItems, loadViewPage, VIEW_PAGE_SIZE} from "@lib/gql/gql-views"

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  paragraph: ParagraphStanfordList
}

const ListParagraph = async ({paragraph, ...props}: Props) => {
  const behaviors = getParagraphBehaviors<ListParagraphBehaviors>(paragraph)
  const viewId = paragraph.suListView?.view || ""
  const displayId = paragraph.suListView?.display || ""
  const limit = paragraph.suListView?.pageSize || VIEW_PAGE_SIZE

  let {items: viewItems, totalItems} =
    viewId && displayId
      ? await getViewPagedItems(viewId, displayId, paragraph.suListView?.contextualFilter, limit, 0)
      : {items: [], totalItems: 0}

  if (limit) viewItems = viewItems.slice(0, limit)

  const addLoadMore = (limit || 3) >= VIEW_PAGE_SIZE && totalItems > viewItems.length

  if (behaviors.list_paragraph?.hide_empty && viewItems.length === 0) return null

  const ListWrapper: ElementType =
    paragraph.suListHeadline && behaviors.list_paragraph?.heading_behavior !== "remove" ? "section" : "div"

  return (
    <ListWrapper
      {...props}
      className={twMerge("centered mb-20 flex flex-col gap-10 xl:max-w-[980px]", props.className)}
      aria-labelledby={ListWrapper === "section" ? paragraph.id : undefined}
    >
      {behaviors.list_paragraph?.heading_behavior !== "remove" && (
        <H2
          id={paragraph.id}
          className={twMerge("text-center", behaviors.list_paragraph?.heading_behavior === "hide" && "sr-only")}
        >
          {paragraph.suListHeadline}
        </H2>
      )}

      <Wysiwyg html={paragraph.suListDescription?.processed} />

      {viewId && displayId && viewItems && (
        <Suspense>
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
                    paragraph.suListView?.contextualFilter || [],
                    !!paragraph.suListHeadline
                  )
                : undefined
            }
            totalItems={totalItems}
          />
        </Suspense>
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
