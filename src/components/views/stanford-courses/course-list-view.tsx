import StanfordCourseListItem from "@components/nodes/list-item/stanford-course/stanford-course-list-item"
import LoadMoreList from "@components/elements/load-more-list"
import {NodeStanfordCourse} from "@lib/gql/__generated__/graphql"
import {ViewDisplayProps} from "@components/views/view"
import {getTermFilterGroups} from "@lib/gql/gql-queries"
import {FilterVocabs} from "@lib/gql/filter-vocabs"
import FilteredListViewClient from "@components/views/filtered-list-view/filtered-list-view.client"

const CourseListView = async ({
  items,
  totalItems,
  headingLevel,
  loadPage,
  filtered,
}: ViewDisplayProps<NodeStanfordCourse>) => {
  if (filtered) {
    const filters = await getTermFilterGroups(FilterVocabs.Courses)

    return (
      <FilteredListViewClient
        ulProps={{className: "list-unstyled mb-20"}}
        liProps={{
          className: "border-b border-black-20 last-of-type:border-0 pb-10 last:pb-0 pt-10 first:pt-0",
        }}
        totalItems={totalItems}
        loadPage={loadPage}
        filters={filters}
        filterKey="filter"
      >
        {items.map(item => (
          <StanfordCourseListItem key={item.uuid} node={item} headingLevel={headingLevel} />
        ))}
      </FilteredListViewClient>
    )
  }

  return (
    <LoadMoreList
      buttonText={
        <>
          Load More<span className="sr-only">&nbsp;courses</span>
        </>
      }
      ulProps={{className: "list-unstyled mb-20"}}
      liProps={{
        className: "border-b border-black-20 last-of-type:border-0 pb-10 last:pb-0 pt-10 first:pt-0",
      }}
      totalItems={totalItems}
      loadPage={loadPage}
    >
      {items.map(item => (
        <StanfordCourseListItem key={item.uuid} node={item} headingLevel={headingLevel} />
      ))}
    </LoadMoreList>
  )
}
export default CourseListView
