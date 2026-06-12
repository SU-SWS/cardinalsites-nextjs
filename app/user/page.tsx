import InteriorPage from "@components/layouts/interior-page"
import {H1} from "@components/elements/headers"
import {Metadata} from "next"
import {headers} from "next/headers"
import LogoutButton from "@components/elements/auth/logout-button"
import {Suspense} from "react"

export const metadata: Metadata = {
  title: "User",
  robots: {index: false, follow: false, noarchive: false},
}

const Page = async () => {
  return (
    <Suspense>
      <UserPage />
    </Suspense>
  )
}

const UserPage = async () => {
  const headersList = await headers()
  const userId = headersList.get("x-user-id")
  const userEmail = headersList.get("x-user-email")
  const userName = headersList.get("x-user-name")

  return (
    <InteriorPage>
      <H1 className="mt-32">{userName}</H1>
      <ul className="mb-20">
        <li>User ID: {userId}</li>
        <li>Email: {userEmail}</li>
      </ul>
      <LogoutButton className="mx-auto" />
    </InteriorPage>
  )
}

export default Page
