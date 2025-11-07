import NodePage from "@components/nodes/pages/node-page"
import {NodeUnion} from "@lib/gql/__generated__/drupal.d"
import {getEntityFromPath} from "@lib/gql/gql-queries"
import {notFound, redirect} from "next/navigation"

// https://vercel.com/docs/functions/runtimes#max-duration
export const maxDuration = 60

const Page = async () => {
  "use cache"
  const {redirect: redirectPath, entity} = await getEntityFromPath<NodeUnion>(`/internal`)

  if (redirectPath) redirect(redirectPath)
  if (!entity) notFound()

  return <NodePage node={entity} />
}

export default Page
