import NodePage from "@components/nodes/pages/node-page"
import {NodeUnion} from "@lib/gql/__generated__/graphql"
import {getEntityFromPath} from "@lib/gql/gql-queries"
import {notFound, redirect} from "next/navigation"

const Page = async () => {
  "use cache"
  const {redirect: redirectPath, entity} = await getEntityFromPath<NodeUnion>(`/internal`)

  if (redirectPath) redirect(redirectPath)
  if (!entity) notFound()

  return <NodePage node={entity} />
}

export default Page
