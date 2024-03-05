import StanfordPageListItem from "@components/nodes/list-item/stanford-page/stanford-page-list-item";
import LoadMoreList from "@components/elements/load-more-list";
import {NodeStanfordPage} from "@lib/gql/__generated__/drupal.d";

interface Props {
  headingLevel?: "h2" | "h3"
  items?: NodeStanfordPage[]
}

const PageListView = async ({items = [], headingLevel}: Props) => {
  return (
    <LoadMoreList
      ulProps={{className: "list-unstyled mb-20"}}
      liProps={{className: "border-b border-black-20 last-of-type:border-0 pb-10 last:pb-0 pt-10 first:pt-0"}}
    >
      {items.map(item =>
        <StanfordPageListItem key={item.id} node={item} headingLevel={headingLevel}/>
      )}
    </LoadMoreList>
  )
}
export default PageListView;