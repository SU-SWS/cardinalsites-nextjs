"use client";

import {useLayoutEffect, useRef, HtmlHTMLAttributes, JSX, useId} from "react";
import Button from "@components/elements/button";
import {useAutoAnimate} from "@formkit/auto-animate/react";
import {useBoolean, useCounter} from "usehooks-ts";
import useFocusOnRender from "@lib/hooks/useFocusOnRender";

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
}

const LoadMoreList = ({buttonText, children, ulProps, liProps, itemsPerPage = 10, ...props}: Props) => {
  const id = useId();
  const {count: shownItems, setCount: setShownItems} = useCounter(itemsPerPage)
  const {value: focusOnElement, setTrue: enableFocusElement, setFalse: disableFocusElement} = useBoolean(false)

  const focusItemRef = useRef<HTMLLIElement>(null);
  const [animationParent] = useAutoAnimate<HTMLUListElement>();

  const showMoreItems = () => {
    enableFocusElement();
    setShownItems(shownItems + itemsPerPage);
  }

  const setFocusOnItem = useFocusOnRender(focusItemRef, false);

  useLayoutEffect(() => {
    if (focusOnElement) setFocusOnItem()
  }, [focusOnElement, setFocusOnItem]);

  const focusingItem = shownItems - itemsPerPage;
  const items = Array.isArray(children) ? children : [children]
  const itemsToShow = items.slice(0, shownItems);
  return (
    <div {...props}>
      <ul {...ulProps} ref={animationParent}>

        {itemsToShow.map((item, i) =>
          <li
            key={`${id}--${i}`}
            ref={focusingItem === i ? focusItemRef : null}
            tabIndex={focusingItem === i && focusOnElement ? 0 : undefined}
            onBlur={disableFocusElement}
            {...liProps}
          >
            {item}
          </li>
        )}
      </ul>

      {items.length > itemsPerPage &&
        <span className="sr-only" aria-live="polite" aria-atomic="true">
          Showing {itemsToShow.length} of {items.length} total items.
        </span>
      }

      {items.length > shownItems &&
        <Button centered onClick={showMoreItems}>
          {buttonText ? buttonText : "Load More"}
        </Button>
      }
    </div>
  )
}
export default LoadMoreList;