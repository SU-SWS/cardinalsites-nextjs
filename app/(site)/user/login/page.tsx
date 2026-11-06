import LoginButton from "@components/elements/auth/login-button"
import InteriorPage from "@components/layouts/interior-page"
import {H1} from "@components/elements/headers"
import {Metadata} from "next"

export const metadata: Metadata = {
  title: "Login",
  robots: {index: false, follow: false, noarchive: false},
}

const Page = async () => (
  <InteriorPage>
    <H1 className="mt-64">Site Log In</H1>
    <LoginButton className="mx-auto" />
  </InteriorPage>
)

export default Page
