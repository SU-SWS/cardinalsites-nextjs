"use client"

import React, {HtmlHTMLAttributes, useCallback, useRef} from "react"
import {useRouter} from "next/navigation"
import ReactFocusLock from "react-focus-lock"
import {XMarkIcon} from "@heroicons/react/24/solid"
import {useEventListener, useScrollLock} from "usehooks-ts"
import cn from "@lib/utils/className"

const InterceptionModal = ({children, ...props}: HtmlHTMLAttributes<HTMLDialogElement>) => {
  const overlay = useRef<HTMLDialogElement>(null)
  const wrapper = useRef<HTMLDivElement>(null)
  const router = useRouter()
  useScrollLock()

  const onDismiss = useCallback(() => router.back(), [router])

  const onClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === overlay.current || e.target === wrapper.current) onDismiss()
    },
    [onDismiss, overlay, wrapper]
  )

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") onDismiss()
  }

  useEventListener("keydown", onKeyDown)

  return (
    <ReactFocusLock
      returnFocus
      as="dialog"
      ref={overlay}
      className={cn("fixed left-0 top-0 z-[10000] h-lvh w-screen bg-black-true bg-opacity-90", props.className)}
      onClick={onClick}
      lockProps={{open: true}}
      {...props}
    >
      <div ref={wrapper} className="relative top-[8%] mx-auto h-5/6 w-10/12 max-w-1200 overflow-hidden md:w-3/4">
        {children}
      </div>

      <button
        type="button"
        onClick={onDismiss}
        className="group absolute -right-[100px] -top-[100px] flex h-[200px] w-[200px] items-center rounded-full bg-black-true bg-opacity-40 text-white"
      >
        <span className="sr-only">Close Overlay</span>
        <XMarkIcon
          className="translate-x-[50px] translate-y-[35px] border-b-2 border-transparent group-hocus:border-white"
          width={25}
        />
      </button>
    </ReactFocusLock>
  )
}

export default InterceptionModal
