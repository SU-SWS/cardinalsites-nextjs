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

    // Pages count is determined as siblingCount + firstPage + lastPage + currentPage + 2 * DOTS + 2 * ARROWS
    const totalPageNumbers = siblingCount + 7

    // Arrow constants
    const leftArrow = "leftArrow"
    const rightArrow = "rightArrow"

    // Case 1: If the number of pages is less than the page numbers we want to show in our paginationComponent, we
    // return the range [1..totalPageCount]
    if (totalPageNumbers >= totalPageCount) {
      return [leftArrow, ...range(1, totalPageCount), rightArrow]
    }

    // Calculate left and right sibling index and make sure they are within range 1 and totalPageCount
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1)
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPageCount)

    // We do not show dots just when there is just one page number to be inserted between the extremes of sibling and the page limits i.e 1 and totalPageCount. Hence we are using leftSiblingIndex > 2 and rightSiblingIndex < totalPageCount - 2
    const shouldShowLeftDots = leftSiblingIndex > 2
    const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2

    const firstPageIndex = 1
    const lastPageIndex = totalPageCount

    // Case 2: No left dots to show, but rights dots to be shown
    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount
      const leftRange = range(1, leftItemCount)

      return [leftArrow, ...leftRange, 0, totalPageCount, rightArrow]
    }

    // Case 3: No right dots to show, but left dots to be shown
    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount
      const rightRange = range(totalPageCount - rightItemCount + 1, totalPageCount)

      return [leftArrow, firstPageIndex, 0, ...rightRange, rightArrow]
    }

    // Case 4: Both left and right dots to be shown
    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex)
      return [leftArrow, firstPageIndex, 0, ...middleRange, 0, lastPageIndex, rightArrow]
    }
    return []
  }, [totalCount, pageSize, siblingCount, currentPage])
}

const range = (start: number, end: number) => {
  let length = end - start + 1
  /*
  	Create an array of certain length and set the elements within it from
    start value to end value.
  */
  return Array.from({length}, (_, idx) => idx + start)
}

export default usePagination
