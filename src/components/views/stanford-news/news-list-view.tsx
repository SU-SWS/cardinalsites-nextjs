import StanfordNewsListItem from "@components/nodes/list-item/stanford-news/stanford-news-list-item"
import {NodeStanfordNews} from "@lib/gql/__generated__/drupal.d"
import PagedList from "@components/elements/paged-list"
import {ViewDisplayProps} from "@components/views/view"

const NewsListView = async ({items, headingLevel, totalItems, loadPage}: ViewDisplayProps<NodeStanfordNews>) => {
  return (
    <PagedList
      ulProps={{className: "list-unstyled mb-20"}}
      liProps={{
        className: "border-b border-black-20 last-of-type:border-0 pb-10 last:pb-0 pt-10 first:pt-0",
      }}
      pageKey="news"
      totalPages={Math.ceil(totalItems / 30)}
      loadPage={loadPage}
    >
      {items.map(item => (
        <StanfordNewsListItem key={item.id} node={item} headingLevel={headingLevel} />
      ))}
    </PagedList>
  )
}

export const NewsListSkeleton = () => {
  return (
    <div>
      <div className="flex min-h-[200px] items-center justify-between border-b border-black-20 pb-10">
        <div className="flex-grow">
          <div className="mb-5 h-7 w-1/3 bg-black-10" />
          <div className="mb-10 h-16 w-1/2 bg-black-10" />
          <div className="mb-5 h-7 w-1/3 bg-black-10" />
        </div>
        <div className="relative order-1 mb-10 aspect-[16/9] shrink-0 bg-black-10 @3xl:order-2 @3xl:mb-0 @3xl:w-1/4" />
      </div>
      <div className="flex min-h-[150px] items-center justify-between pt-10">
        <div className="flex-grow">
          <div className="mb-5 h-7 w-1/3 bg-black-10" />
          <div className="mb-10 h-16 w-1/2 bg-black-10" />
          <div className="mb-5 h-7 w-1/3 bg-black-10" />
        </div>
        <div className="relative order-1 mb-10 aspect-[16/9] shrink-0 bg-black-10 @3xl:order-2 @3xl:mb-0 @3xl:w-1/4" />
      </div>
    </div>
  )
}

export default NewsListView
