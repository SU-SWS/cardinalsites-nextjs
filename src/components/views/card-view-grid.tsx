import NodeCard from "@components/nodes/cards/node-card"
import LoadMoreList from "@components/elements/load-more-list"
import {ViewDisplayProps} from "@components/views/view"

const CardViewGrid = ({items, totalItems, headingLevel, loadPage}: ViewDisplayProps) => {
  return (
    <LoadMoreList
      ulProps={{className: "list-unstyled grid @4xl:grid-cols-2 @7xl:grid-cols-3 gap-20 mb-20"}}
      liProps={{className: ""}}
      totalItems={totalItems}
      loadPage={loadPage}
    >
      {items.map(item => (
        <NodeCard node={item} key={item.id} headingLevel={headingLevel} />
      ))}
    </LoadMoreList>
  )
}

export default CardViewGrid
