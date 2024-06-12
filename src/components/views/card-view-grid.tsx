import NodeCard from "@components/nodes/cards/node-card"
import LoadMoreList from "@components/elements/load-more-list"
import {NodeUnion} from "@lib/gql/__generated__/drupal.d"

type Props = {
  /**
   * List of node entities.
   */
  items: NodeUnion[]
  /**
   * If those nodes titles should display as <h2> or <h3>
   */
  headingLevel?: "h2" | "h3"
}

const CardViewGrid = ({items, headingLevel}: Props) => {
  return (
    <LoadMoreList
      ulProps={{className: "list-unstyled grid @4xl:grid-cols-2 @7xl:grid-cols-3 gap-20 mb-20"}}
      liProps={{className: ""}}
    >
      {items.map(item => (
        <NodeCard
          node={item}
          key={item.id}
          headingLevel={headingLevel}
        />
      ))}
    </LoadMoreList>
  )
}

export default CardViewGrid
