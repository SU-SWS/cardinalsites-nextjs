"use client"

import Button from "@components/elements/button"
import {useBoolean} from "usehooks-ts"
import {HTMLAttributes, useEffect, useRef} from "react"
import {MinusIcon, PlusIcon} from "@heroicons/react/16/solid"
import cn from "@lib/utils/className"

type Props = HTMLAttributes<HTMLButtonElement>

const ExpandCollapseAll = ({...props}: Props) => {
  const {value: expand, toggle} = useBoolean(true)
  const ref = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const buttons = ref.current?.parentElement?.parentElement?.getElementsByTagName("button") || []
    for (let i = 0; i < buttons.length; i++) {
      if (!expand && buttons[i].getAttribute("aria-expanded") === "false") {
        buttons[i].click()
      }

      if (expand && buttons[i].getAttribute("aria-expanded") === "true") {
        buttons[i].click()
      }
    }
  }, [expand])

  return (
    <Button
      /* @ts-expect-error ref object type issue. */
      ref={ref}
      buttonElem
      onClick={toggle}
      secondary
      {...props}
      className={cn("flex items-center gap-5 whitespace-nowrap", props.className)}
    >
      {expand ? "Expand All" : "Collapse All"}
      {expand && <PlusIcon width={20} />}
      {!expand && <MinusIcon width={20} />}
    </Button>
  )
}

export default ExpandCollapseAll
