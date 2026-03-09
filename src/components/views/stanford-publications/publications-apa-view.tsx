import {NodeStanfordPublication} from "@lib/gql/__generated__/graphql"
import {ViewDisplayProps} from "@components/views/view"
import LoadMoreList from "@components/elements/load-more-list"
import StanfordPublicationListItem from "@components/nodes/list-item/stanford-publication/stanford-publication-list-item"

const PublicationsApaView = async ({items, totalItems, loadPage}: ViewDisplayProps<NodeStanfordPublication>) => {
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
        <StanfordPublicationListItem key={item.uuid} node={item} apa />
      ))}
    </LoadMoreList>
  )
}
export default PublicationsApaView
