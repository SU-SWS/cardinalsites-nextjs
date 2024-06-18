import {isPreviewMode} from "@lib/drupal/is-preview-mode"
import Editori11y from "@components/tools/editorially"
import EditorAlert from "@components/elements/editor-alert"

const Layout = ({children}: {children: React.ReactNode}) => {
  const inPreview = isPreviewMode()
  return (
    <>
      {inPreview && (
        <>
          <Editori11y />
          <EditorAlert
            status={false}
            message="Preview Mode"
          />
        </>
      )}
      {children}
    </>
  )
}
export default Layout
