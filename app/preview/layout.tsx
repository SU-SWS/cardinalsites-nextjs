import {isPreviewMode} from "@lib/drupal/utils"
import Editori11y from "@components/tools/editorially"
import UnpublishedBanner from "@components/elements/unpublished-banner"

const Layout = ({children}: {children: React.ReactNode}) => {
  const inPreview = isPreviewMode()
  return (
    <>
      {inPreview && (
        <>
          <Editori11y />
          <UnpublishedBanner status={false}>Preview Mode</UnpublishedBanner>
        </>
      )}
      {children}
    </>
  )
}
export default Layout
