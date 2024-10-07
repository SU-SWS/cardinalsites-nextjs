import PageHeader from "@components/global/page-header"
import BackToTop from "@components/elements/back-to-top"
import PageFooter from "@components/global/page-footer"
import {HTMLAttributes} from "react"
import twMerge from "@lib/utils/twMerge"

type Props = HTMLAttributes<HTMLDivElement>
const GlobalPage = ({children, ...props}: Props) => {
  return (
    <div {...props} className={twMerge("flex min-h-screen flex-col", props.className)}>
      <PageHeader />

      <main id="main-content" className="mb-32 flex-grow">
        {children}
      </main>

      <BackToTop />

      <PageFooter />
    </div>
  )
}
export default GlobalPage
