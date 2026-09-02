"use client"

import React, {HtmlHTMLAttributes, useRef} from "react"
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

  const onDismiss = () => router.back()

  const onClick = (e: React.MouseEvent) => {
    if (e.target === overlay.current || e.target === wrapper.current) onDismiss()
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") onDismiss()
  }

  useEventListener("keydown", onKeyDown)

  return (
    <ReactFocusLock
      returnFocus
      as="dialog"
      ref={overlay}
      className={cn("fixed top-0 left-0 z-10000 h-lvh w-screen bg-black-true/90", props.className)}
      onClick={onClick}
      lockProps={{open: true}}
      {...props}
    >
      <div ref={wrapper} className="relative top-[8%] mx-auto h-5/6 w-10/12 max-w-12xl overflow-hidden md:w-3/4">
        {children}
      </div>

      <button
        type="button"
        onClick={onDismiss}
        className="group absolute -top-100 -right-100 flex h-200 w-xs items-center rounded-full bg-black-true/40 text-white"
      >
        <span className="sr-only">Close Overlay</span>
        <XMarkIcon
          className="translate-x-50 translate-y-35 border-b-2 border-transparent group-hocus:border-white"
          width={25}
        />
      </button>
    </ReactFocusLock>
  )
}

export default InterceptionModal
