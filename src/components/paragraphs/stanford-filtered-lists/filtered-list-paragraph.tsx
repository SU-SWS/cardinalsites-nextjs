import Wysiwyg from "@components/elements/wysiwyg"
import View from "@components/views/view"
import {H2} from "@components/elements/headers"
import {ElementType, HtmlHTMLAttributes, Suspense} from "react"
import {ParagraphStanfordFilteredList} from "@lib/gql/__generated__/drupal.d"
import {getParagraphBehaviors} from "@components/paragraphs/get-paragraph-behaviors"
import twMerge from "@lib/utils/twMerge"
import {ListParagraphBehaviors} from "drupal"
import {getViewPagedItems, loadViewPage, VIEW_PAGE_SIZE} from "@lib/gql/gql-views"

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  paragraph: ParagraphStanfordFilteredList
}

const FilteredListParagraph = async ({paragraph, ...props}: Props) => {
  const behaviors = getParagraphBehaviors<ListParagraphBehaviors>(paragraph)
  const viewId = paragraph.suFilteredListView?.view || ""
  const displayId = paragraph.suFilteredListView?.display || ""
  const limit = paragraph.suFilteredListView?.pageSize || VIEW_PAGE_SIZE

  const pagedItems =
    viewId && displayId
      ? await getViewPagedItems(viewId, displayId, limit, paragraph.suFilteredListView?.contextualFilter)
      : {items: [], totalItems: 0}

  const {totalItems} = pagedItems
  const viewItems = limit ? pagedItems.items.slice(0, VIEW_PAGE_SIZE) : pagedItems.items

  const addLoadMore =
    viewId.includes("filter") ||
    displayId.includes("") ||
    ((limit || 3) >= VIEW_PAGE_SIZE && totalItems > viewItems.length)

  if (behaviors.list_paragraph?.hide_empty && viewItems.length === 0) return null

  const ListWrapper: ElementType =
    paragraph.suListHeadline && behaviors.list_paragraph?.heading_behavior !== "remove" ? "section" : "div"

  return (
    <ListWrapper
      {...props}
      className={twMerge("centered mb-20 flex flex-col gap-10", props.className)}
      aria-labelledby={ListWrapper === "section" ? paragraph.uuid : undefined}
      data-nosnippet
    >
      {paragraph.suListHeadline && behaviors.list_paragraph?.heading_behavior !== "remove" && (
        <H2
          id={paragraph.uuid}
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
                    !!paragraph.suListHeadline,
                    VIEW_PAGE_SIZE,
                    paragraph.suFilteredListView?.contextualFilter || []
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
    </ListWrapper>
  )
}

export default FilteredListParagraph
