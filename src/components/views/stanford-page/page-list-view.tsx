import StanfordPageListItem from "@components/nodes/list-item/stanford-page/stanford-page-list-item"
import LoadMoreList from "@components/elements/load-more-list"
import {NodeStanfordPage} from "@lib/gql/__generated__/drupal.d"
import {ViewDisplayProps} from "@components/views/view"

const PageListView = async ({items, headingLevel, totalItems, loadPage}: ViewDisplayProps<NodeStanfordPage>) => {
  return (
    <LoadMoreList
      ulProps={{className: "list-unstyled mb-20"}}
      liProps={{
        className: "border-b border-black-20 last-of-type:border-0 pb-10 last:pb-0 pt-10 first:pt-0",
      }}
      totalItems={totalItems}
      loadPage={loadPage}
    >
      {items.map(item => (
        <StanfordPageListItem key={item.id} node={item} headingLevel={headingLevel} />
      ))}
    </LoadMoreList>
  )
}
export default PageListView
