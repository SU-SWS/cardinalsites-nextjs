"use client"

import {useLayoutEffect, useRef, HtmlHTMLAttributes, JSX, useId, useState} from "react"
import {useBoolean, useCounter} from "usehooks-ts"
import useFocusOnRender from "@lib/hooks/useFocusOnRender"
import useServerAction from "@lib/hooks/useServerAction"
import {twMerge} from "tailwind-merge"
import {ArrowPathIcon} from "@heroicons/react/20/solid"
import Button from "@components/elements/button"

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  /**
   * Load more button text/element.
   */
  buttonText?: string | JSX.Element
  /**
   * Attributes for the <ul> container.
   */
  ulProps?: HtmlHTMLAttributes<HTMLUListElement>
  /**
   * Attributes for each <li> element.
   */
  liProps?: HtmlHTMLAttributes<HTMLLIElement>
  /**
   * The number of items per page.
   */
  itemsPerPage?: number
  /**
   * Elements to display initially.
   */
  children: JSX.Element[]
  /**
   * Server action callback to fetch the next "page" contents.
   */
  loadPage?: (_page: number) => Promise<JSX.Element>
  /**
   * Count of the total number of items of all pages.
   */
  totalItems: number
}

const LoadMoreList = ({buttonText, children, ulProps, liProps, totalItems, loadPage, ...props}: Props) => {
  const id = useId()
  const {count: page, increment: incrementPage} = useCounter(0)
  const [items, setItems] = useState<JSX.Element[]>(children)
  const {value: focusOnElement, setTrue: enableFocusElement, setFalse: disableFocusElement} = useBoolean(false)
  const [runLoadPage, isPending] = useServerAction(loadPage)

  const focusItemRef = useRef<HTMLLIElement>(null)

  const showMoreItems = async () => {
    if (loadPage) {
      const results = await runLoadPage(page + 1)
      setItems([...items, ...results?.props.children])
    }

    enableFocusElement()
    incrementPage()
  }

  const setFocusOnItem = useFocusOnRender(focusItemRef, false)

  useLayoutEffect(() => {
    if (focusOnElement) setFocusOnItem()
  }, [focusOnElement, setFocusOnItem])

  return (
    <div {...props} className={twMerge("relative", props.className)}>
      {isPending && (
        <div className="absolute left-0 top-0 z-20 h-full w-full bg-black-30 bg-opacity-80">
          <div className="absolute bottom-20 left-1/2 -translate-x-[25px]">
            <ArrowPathIcon className="animate-spin" width={50} />
          </div>
        </div>
      )}
      <ul {...ulProps}>
        {items.map((item, i) => (
          <li
            key={`${id}--${i}`}
            ref={i === children.length * page ? focusItemRef : null}
            tabIndex={i === children.length * page && focusOnElement ? 0 : undefined}
            onBlur={disableFocusElement}
            {...liProps}
          >
            {item}
          </li>
        ))}
      </ul>
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        Showing {items.length} items.
      </span>

      {items.length < totalItems && loadPage && (
        <Button buttonElem centered onClick={showMoreItems}>
          {buttonText ? buttonText : "Load More"}
        </Button>
      )}
    </div>
  )
}
export default LoadMoreList
