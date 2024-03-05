"use client";

import {useLayoutEffect, useRef, HtmlHTMLAttributes, JSX, useId} from "react";
import Button from "@components/elements/button";
import {useAutoAnimate} from "@formkit/auto-animate/react";
import {useBoolean, useCounter} from "usehooks-ts";

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  buttonText?: string | JSX.Element
  ulProps?: HtmlHTMLAttributes<HTMLUListElement>
  liProps?: HtmlHTMLAttributes<HTMLLIElement>,
  itemsPerPage?: number
}

const LoadMoreList = ({buttonText, children, ulProps, liProps, itemsPerPage = 15, ...props}: Props) => {
  const id = useId();
  const {count: shownItems, setCount: setShownItems} = useCounter(itemsPerPage)
  const {value: focusOnElement, setTrue: enableFocusElement, setFalse: disableFocusElement} = useBoolean(false)

  const ref = useRef<HTMLLIElement>(null);
  const [animationParent] = useAutoAnimate();

  const showMoreItems = () => {
    enableFocusElement();
    setShownItems(shownItems + itemsPerPage);
  }

  useLayoutEffect(() => ref.current?.focus(), [shownItems]);

  const focusingItem = shownItems - itemsPerPage;
  const items = Array.isArray(children) ? children : [children]
  const itemsToShow = items.slice(0, shownItems);
  return (
    <div {...props}>
      <ul {...ulProps} ref={animationParent}>

        {itemsToShow.map((item, i) =>
          <li
            key={`${id}--${i}`}
            ref={focusingItem === i ? ref : null}
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