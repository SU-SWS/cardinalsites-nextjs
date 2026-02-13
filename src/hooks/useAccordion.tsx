"use client"

import {HTMLAttributes, useId} from "react"
import {useBoolean} from "usehooks-ts"

type Props = {
  initiallyVisible?: boolean
  panelId?: string
  buttonId?: string
}

const useAccordion = ({initiallyVisible, panelId, buttonId}: Props = {}) => {
  const {
    value: expanded,
    setTrue: expandAccordion,
    setFalse: collapseAccordion,
    toggle: toggleExpanded,
  } = useBoolean(initiallyVisible)
  const id = useId()

  const buttonProps: HTMLAttributes<HTMLButtonElement> = {
    "aria-controls": panelId || `${id}--panel`,
    "aria-expanded": expanded,
    id: buttonId || `${id}--button`,
    onClick: toggleExpanded,
  }
  const panelProps: HTMLAttributes<HTMLElement> = {
    "aria-labelledby": buttonId || `${id}--button`,
    id: panelId || `${id}--panel`,
    role: "region",
    className: expanded ? "block" : "hidden",
  }
  return {buttonProps, panelProps, expanded, toggleExpanded, expandAccordion, collapseAccordion}
}
export default useAccordion
