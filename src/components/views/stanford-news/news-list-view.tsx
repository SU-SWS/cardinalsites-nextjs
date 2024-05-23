import StanfordNewsListItem from "@components/nodes/list-item/stanford-news/stanford-news-list-item";
import {NodeStanfordNews} from "@lib/gql/__generated__/drupal.d";
import PagedList from "@components/elements/paged-list";
import {JSX} from "react";

interface Props {
  /**
   * List of nodes to display.
   */
  items: NodeStanfordNews[]
  /**
   * If those nodes titles should display as <h2> or <h3>
   */
  headingLevel?: "h2" | "h3"
  /**
   * Total number of items to build the pager.
   */
  totalItems: number
  /**
   * Server action to load a page.
   */
  loadPage?: (_page: number) => Promise<JSX.Element>
}

const NewsListView = async ({items, totalItems, headingLevel, loadPage}: Props) => {
  return (
    <PagedList
      ulProps={{className: "list-unstyled mb-20"}}
      liProps={{className: "border-b border-black-20 last-of-type:border-0 pb-10 last:pb-0 pt-10 first:pt-0"}}
      pageKey="news"
      totalPages={Math.ceil(totalItems / 30)}
      loadPage={loadPage}
    >
      {items.map(item =>
        <StanfordNewsListItem key={item.id} node={item} headingLevel={headingLevel}/>
      )}
    </PagedList>
  )
}
export default NewsListView;