"use client";

import {useLayoutEffect, useRef, HtmlHTMLAttributes, useEffect} from "react";
import Button from "@components/elements/button";
import {useAutoAnimate} from "@formkit/auto-animate/react";
import {useBoolean, useCounter} from "usehooks-ts";
import {useRouter, useSearchParams} from "next/navigation";
import usePagination from "@lib/hooks/usePagination";
import useFocusOnRender from "@lib/hooks/useFocusOnRender";

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  /**
   * Attributes for the <ul> container.
   */
  ulProps?: HtmlHTMLAttributes<HTMLUListElement>
  /**
   * Attributes for each <li> element.
   */
  liProps?: HtmlHTMLAttributes<HTMLLIElement>,
  /**
   * The number of items per page.
   */
  itemsPerPage?: number
  /**
   * URL parameter used to save the users page position.
   */
  pageKey?: string
}

const PagedList = ({children, ulProps, liProps, itemsPerPage = 10, pageKey = 'page', ...props}: Props) => {
  const items = Array.isArray(children) ? children : [children]

  const router = useRouter();
  const searchParams = useSearchParams()

  // Use the GET param for page, but make sure that it is between 1 and the last page. If it's a string or a number
  // outside the range, fix the value, so it works as expected.
  const {count: page, setCount: setPage} = useCounter(Math.max(1, Math.min(Math.ceil(items.length / itemsPerPage), parseInt(searchParams.get(pageKey) || '') || 1)))
  const {value: focusOnElement, setTrue: enableFocusElement, setFalse: disableFocusElement} = useBoolean(false)

  const focusItemRef = useRef<HTMLLIElement>(null);
  const [animationParent] = useAutoAnimate<HTMLUListElement>();

  const goToPage = (page: number) => {
    enableFocusElement();
    setPage(page);
  }

  const setFocusOnItem = useFocusOnRender(focusItemRef, false);

  useLayoutEffect(() => {
    if (focusOnElement) setFocusOnItem()
  }, [focusOnElement, setFocusOnItem]);

  useEffect(() => {
    // Use search params to retain any other parameters.
    const params = new URLSearchParams(searchParams.toString());
    if (page > 1) {
      params.set(pageKey, `${page}`)
    } else {
      params.delete(pageKey)
    }

    router.replace(`?${params.toString()}`, {scroll: false})
  }, [router, page, pageKey, searchParams]);
  const paginationButtons = usePagination(items.length, page, itemsPerPage, 2);

  return (
    <div {...props}>
      <ul {...ulProps} ref={animationParent}>
        {items.slice((page - 1) * itemsPerPage, page * itemsPerPage).map((item, i) =>
          <li
            key={`pager--${i}`}
            ref={i === 0 ? focusItemRef : null}
            tabIndex={i === 0 && focusOnElement ? 0 : undefined}
            onBlur={disableFocusElement}
            {...liProps}
          >
            {item}
          </li>
        )}
      </ul>

      {paginationButtons.length > 1 &&
        <nav aria-label="Pager">
          <ul className="list-unstyled flex justify-between">
            {paginationButtons.map((pageNum, i) => (
              <PaginationButton
                key={`page-button-${pageNum}--${i}`}
                page={pageNum}
                currentPage={page}
                total={Math.ceil(items.length / itemsPerPage)}
                onClick={() => goToPage(pageNum)}
              />
            ))}
          </ul>
        </nav>
      }
    </div>
  )
}

const PaginationButton = ({page, currentPage, total, onClick}: {
  page: number | string
  currentPage: number
  total: number
  onClick: () => void
}) => {
  if (page === 0) {
    return (
      <li className="h-full mt-auto">
        <span className="sr-only">More pages available</span>
        <span aria-hidden>...</span>
      </li>
    )
  }

  return (
    <li>
      <Button
        className={page === currentPage ? "bg-black text-white" : ""}
        onClick={onClick}
        aria-current={page == currentPage || undefined}
      >
        <span className="sr-only">Go to page {page} of {total}</span>
        <span aria-hidden>{page}</span>
      </Button>
    </li>
  )
}

export default PagedList;