import CacheClearForm from "./form"
import {H1} from "@components/elements/headers"
import {Metadata} from "next"

export const revalidate = 0

export const metadata: Metadata = {
  title: "Cache Management | Summer Session",
}

export default async function CacheClearPage() {
  return (
    <div className="centered my-32">
      <H1>Cache Management</H1>
      <CacheClearForm />
    </div>
  )
}
