import {getViewPagedItems, loadViewPage} from "@lib/gql/gql-views"
import SiteSearchClient from "@components/search/site-search.client"
import NodeListItem from "@components/nodes/list-item/node-list-item"
import SiteSearchForm from "@components/search/site-search-form"

type Props = {
  search: string
}
const SiteSearch = async ({search}: Props) => {
  let {items: viewItems, totalItems} = await getViewPagedItems("search", "search", undefined, 12, 0, {
    key: search || "",
  })

  const addLoadMore = totalItems > viewItems.length

  return (
    <div className="space-y-24">
      <SiteSearchForm inputValue={search} className="mx-auto w-3/5" />

      {viewItems.length === 0 && <p>No results found for the given search keywords. Please try again.</p>}

      <SiteSearchClient
        totalItems={totalItems}
        loadPage={addLoadMore ? loadViewPage.bind(null, "search", "search", [], false, 12) : undefined}
      >
        {viewItems.map(item => (
          <NodeListItem key={item.id} node={item} headingLevel="h2" />
        ))}
      </SiteSearchClient>
    </div>
  )
}
export default SiteSearch
