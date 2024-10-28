import {useMemo} from "react"

/**
 * Get the array of pages to build the pager navigation buttons.
 *
 * @param totalCount
 *   Total page count.
 * @param currentPage
 *   Current page.
 * @param pageSize
 *   How many items per page.
 * @param siblingCount
 *   How many page buttons to display left and right of the current page.
 */
const usePagination = (totalCount: number, currentPage = 1, pageSize = 5, siblingCount = 2): (number | string)[] => {
  return useMemo(() => {
    const totalPageCount = Math.ceil(totalCount / pageSize)

    // Total pages to display are twice the siblings plus the current page: sibling, current, sibling
    const totalPageNumbers = siblingCount * 2 + 1

    // Arrow constants.
    const leftArrow = "leftArrow"
    const rightArrow = "rightArrow"

    // If the total displayed pages is less than or equal to the total pages, we just display all pages.
    if (totalPageNumbers >= totalPageCount) {
      return range(1, totalPageCount)
    }

    // Start from page 1 or the siblingCount pages away from the current page.
    const leftStart = Math.max(1, Math.max(1, currentPage) - siblingCount)
    const leftRange = range(leftStart, currentPage - 1)

    // End with the next siblingCount pages after the current page, or the last pages in the list.
    const rightRange = range(currentPage + 1, Math.min(totalPageCount, currentPage + siblingCount))

    // If there are more pages past the siblings.
    const shouldShowLeftDots = leftStart > 1
    // If there are more pages after the siblings.
    const shouldShowRightDots = !!rightRange.length && rightRange[rightRange.length - 1] !== totalPageCount

    // More pages exists before and after the displayed pages.
    if (shouldShowLeftDots && shouldShowRightDots) {
      return [leftArrow, 0, ...leftRange, currentPage, ...rightRange, 0, rightArrow]
    }

    // More pages only to the left of the displayed pages.
    if (shouldShowLeftDots) {
      return [leftArrow, 0, ...leftRange, currentPage, ...rightRange]
    }

    // More pages to the right of the displayed pages.
    if (shouldShowRightDots) {
      return [...leftRange, currentPage, ...rightRange, 0, rightArrow]
    }

    return [...leftRange, currentPage, ...rightRange]
  }, [totalCount, pageSize, siblingCount, currentPage])
}

const range = (start: number, end: number) => {
  const length = end - start + 1
  /*
  	Create an array of certain length and set the elements within it from
    start value to end value.
  */
  return Array.from({length}, (_, index) => index + start)
}

export default usePagination
