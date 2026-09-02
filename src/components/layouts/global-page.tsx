import PageHeader from "@components/global/page-header"
import BackToTop from "@components/elements/back-to-top"
import PageFooter from "@components/global/page-footer"
import {HTMLAttributes} from "react"
import cn from "@lib/utils/className"

type Props = HTMLAttributes<HTMLDivElement>
const GlobalPage = ({children, ...props}: Props) => {
  return (
    <div {...props} className={cn("flex min-h-screen flex-col", props.className)}>
      <PageHeader data-nosnippet="true" />

      <main id="main-content" className="grow" tabIndex={-1}>
        {children}
        <BackToTop />
      </main>
      <PageFooter data-nosnippet="true" />
    </div>
  )
}
export default GlobalPage
