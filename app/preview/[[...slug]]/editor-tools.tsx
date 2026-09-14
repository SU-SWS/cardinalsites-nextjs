"use client"

import Editorially from "@components/tools/editorially"
import useDrupalWindowSync from "@hooks/useDrupalWindowSync"

const EditorTools = () => {
  useDrupalWindowSync()
  return <Editorially />
}
export default EditorTools
