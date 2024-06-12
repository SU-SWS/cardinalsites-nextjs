"use client"

import {useLayoutEffect, useRef, HtmlHTMLAttributes, JSX, useId, useState} from "react"
import Button from "@components/elements/button"
import {useAutoAnimate} from "@formkit/auto-animate/react"
import {useBoolean, useCounter} from "usehooks-ts"
import useFocusOnRender from "@lib/hooks/useFocusOnRender"

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
}

const LoadMoreList = ({buttonText, children, ulProps, liProps, loadPage, ...props}: Props) => {
  const id = useId()
  const {count: page, increment: incrementPage} = useCounter(0)
  const [items, setItems] = useState<JSX.Element[]>(children)
  const {value: hasMore, setValue: setHasMore} = useBoolean(!!loadPage)
  const {value: focusOnElement, setTrue: enableFocusElement, setFalse: disableFocusElement} = useBoolean(false)

  const focusItemRef = useRef<HTMLLIElement>(null)
  const [animationParent] = useAutoAnimate<HTMLUListElement>()

  const showMoreItems = async () => {
    if (loadPage) {
      const results = await loadPage(page + 1)
      if (results.props.children.length < 30) setHasMore(false)
      setItems([...items, ...results.props.children])
    }

    enableFocusElement()
    incrementPage()
  }

  const setFocusOnItem = useFocusOnRender(focusItemRef, false)

  useLayoutEffect(() => {
    if (focusOnElement) setFocusOnItem()
  }, [focusOnElement, setFocusOnItem])

  return (
    <div {...props}>
      <ul
        {...ulProps}
        ref={animationParent}
      >
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
      <span
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
      >
        Showing {items.length} items.
      </span>

      {hasMore && (
        <Button
          centered
          onClick={showMoreItems}
        >
          {buttonText ? buttonText : "Load More"}
        </Button>
      )}
    </div>
  )
}
export default LoadMoreList
