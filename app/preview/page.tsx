import {notFound} from "next/navigation"
import {isPreviewMode} from "@lib/drupal/utils"
import Page from "../page"

const PreviewPage = async () => {
  if (!isPreviewMode()) notFound()
  return <Page />
}

export default PreviewPage
