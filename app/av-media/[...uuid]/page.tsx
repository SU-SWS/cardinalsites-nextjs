import {graphqlClient} from "@lib/gql/gql-client"
import {redirect} from "next/navigation"

const Page = async ({params}: {params: Promise<{uuid: Array<string>}>}) => {
  const uuids = (await params).uuid
  const page = await graphqlClient().Node({uuid: uuids[0]})
  if (page.node?.path) redirect(page.node.path)
}
export default Page
