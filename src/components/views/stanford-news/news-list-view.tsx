import StanfordNewsListItem from "@components/nodes/list-item/stanford-news/stanford-news-list-item"
import {NodeStanfordNews} from "@lib/gql/__generated__/graphql"
import PagedList from "@components/elements/paged-list"
import {ViewDisplayProps} from "@components/views/view"
import {Suspense} from "react"

const NewsListView = ({items, headingLevel, totalItems, loadPage}: ViewDisplayProps<NodeStanfordNews>) => {
  return (
    <Suspense fallback={<NewsListSkeleton />}>
      <PagedList
        ulProps={{className: "list-unstyled mb-40"}}
        liProps={{
          className: "border-b border-black-20 last-of-type:border-0 pb-20 last:pb-0 pt-20 first:pt-0",
        }}
        pageKey="news"
        totalPages={Math.ceil(totalItems / 30)}
        loadPage={loadPage}
      >
        {items.map(item => (
          <StanfordNewsListItem key={item.uuid} node={item} headingLevel={headingLevel} />
        ))}
      </PagedList>
    </Suspense>
  )
}

export const NewsListSkeleton = () => {
  return (
    <div>
      <div className="flex min-h-200 items-center justify-between border-b border-black-20 pb-20">
        <div className="grow">
          <div className="mb-10 h-7 w-1/3 bg-black-10" />
          <div className="mb-20 h-16 w-1/2 bg-black-10" />
          <div className="mb-10 h-7 w-1/3 bg-black-10" />
        </div>
        <div className="relative order-1 mb-20 aspect-video shrink-0 bg-black-10 @3xl:order-2 @3xl:mb-0 @3xl:w-1/4" />
      </div>
      <div className="flex min-h-150 items-center justify-between pt-20">
        <div className="grow">
          <div className="mb-10 h-7 w-1/3 bg-black-10" />
          <div className="mb-20 h-16 w-1/2 bg-black-10" />
          <div className="mb-10 h-7 w-1/3 bg-black-10" />
        </div>
        <div className="relative order-1 mb-20 aspect-video shrink-0 bg-black-10 @3xl:order-2 @3xl:mb-0 @3xl:w-1/4" />
      </div>
    </div>
  )
}

export default NewsListView
