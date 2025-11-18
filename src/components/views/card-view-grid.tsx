import NodeCard from "@components/nodes/cards/node-card"
import LoadMoreList from "@components/elements/load-more-list"
import {ViewDisplayProps} from "@components/views/view"
import {getTermFilterGroups} from "@lib/gql/gql-queries"
import {FilterVocabs} from "@lib/gql/filter-vocabs"
import FilteredListViewClient from "@components/views/filtered-list-view/filtered-list-view.client"

type Props = ViewDisplayProps & {
  filteredVocab?: FilterVocabs
  filterKey?: string
}

const CardViewGrid = async ({items, totalItems, headingLevel, loadPage, filteredVocab, filterKey}: Props) => {
  if (filteredVocab && filterKey) {
    const filters = await getTermFilterGroups(filteredVocab)

    return (
      <FilteredListViewClient
        ulProps={{className: "list-unstyled grid @4xl:grid-cols-2 @7xl:grid-cols-3 gap-20 mb-20"}}
        totalItems={totalItems}
        loadPage={loadPage}
        filters={filters}
        filterKey={filterKey}
      >
        {items.map(item => (
          <NodeCard node={item} key={item.uuid} headingLevel={headingLevel} />
        ))}
      </FilteredListViewClient>
    )
  }

  return (
    <LoadMoreList
      ulProps={{className: "list-unstyled grid @4xl:grid-cols-2 @7xl:grid-cols-3 gap-20 mb-20"}}
      liProps={{className: ""}}
      totalItems={totalItems}
      loadPage={loadPage}
    >
      {items.map(item => (
        <NodeCard node={item} key={item.uuid} headingLevel={headingLevel} />
      ))}
    </LoadMoreList>
  )
}

export default CardViewGrid
