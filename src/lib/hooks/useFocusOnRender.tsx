"use client"

import {RefObject, useLayoutEffect} from "react"
import {useBoolean} from "usehooks-ts"

/**
 * When an element renders, focus on it. Or use the function to trigger the focus.
 *
 * @param focusOnElement
 *   Element ref to focus.
 * @param defaultFocus
 *   If the element should be focused immediately: true to focus immediately, false to wait until triggered.
 */
const useFocusOnRender = (focusOnElement: RefObject<HTMLElement>, defaultFocus: boolean = true) => {
  const {value, setTrue, setFalse} = useBoolean(defaultFocus)

  useLayoutEffect(() => {
    if (value) {
      const reduceMotion = !!window.matchMedia("(prefers-reduced-motion: reduce)")?.matches
      focusOnElement.current?.scrollIntoView({behavior: reduceMotion ? "instant" : "smooth"})
      focusOnElement.current?.focus({preventScroll: true})

      setFalse()
    }
  }, [focusOnElement, value, setFalse])

  return setTrue
}
export default useFocusOnRender
