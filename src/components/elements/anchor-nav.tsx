"use client"

import {HTMLAttributes, useCallback, useEffect, useId, useLayoutEffect, useRef, useState} from "react"
import {ChevronDownIcon} from "@heroicons/react/20/solid"
import cn from "@lib/utils/className"
import useOutsideClick from "@hooks/useOutsideClick"
import OnThisPageIcon from "@components/elements/icons/OnThisPageIcon"
import {useBoolean, useEventListener, useWindowSize} from "usehooks-ts"

type HeadingItem = {
  id: string
  text: string
}

type Props = HTMLAttributes<HTMLDivElement> & {
  /**
   * Display links horizontally with overflow into a "More" dropdown.
   */
  horizontal?: boolean
}

const AnchorNav = ({horizontal = false, ...props}: Props) => {
  const [headings, setHeadings] = useState<HeadingItem[]>([])
  const [visibleCount, setVisibleCount] = useState<number | null>(null)
  const {value: overflowOpen, toggle: toggleOverflowOpen, setFalse: closeOverflow} = useBoolean(false)
  const {value: mobileMenuOpen, toggle: toggleMobileMenu, setFalse: closeMobileMenu} = useBoolean(false)

  const mobileButtonRef = useRef<HTMLButtonElement>(null)
  const navRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const overflowContainerRef = useRef<HTMLLIElement>(null)
  const overflowBtnRef = useRef<HTMLButtonElement>(null)
  const itemWidthsRef = useRef<number[]>([])
  const measuredRef = useRef(false)

  const menuButtonId = useId()
  const menuPanelId = useId()
  const mobilePanelId = useId()

  const {width} = useWindowSize({initializeWithValue: false})

  useOutsideClick(navRef, () => closeMobileMenu())
  useOutsideClick(overflowContainerRef, () => closeOverflow())

  useEventListener("keydown", e => {
    if (e.key !== "Escape") return
    if (overflowOpen) {
      closeOverflow()
      overflowBtnRef.current?.focus()
    }
    if (mobileMenuOpen) {
      closeMobileMenu()
      mobileButtonRef.current?.focus()
    }
  })

  // Scan #page-content for visible h2 elements that have an id attribute and are not opted out
  const scanHeadings = useCallback(() => {
    const pageContent = document.querySelector<HTMLElement>("#main-content")
    if (!pageContent) return
    const elements = pageContent.querySelectorAll<HTMLHeadingElement>("h2[id]")
    const items: HeadingItem[] = Array.from(elements)
      .filter(
        el =>
          !el.closest(".no-anchor, .sr-only") &&
          el.checkVisibility({contentVisibilityAuto: true, opacityProperty: true, visibilityProperty: true})
      )
      .map(el => ({
        id: el.id,
        text: el.textContent?.trim() ?? "",
      }))
    setHeadings(items)
  }, [])

  useEffect(() => {
    scanHeadings() // eslint-disable-line react-hooks/set-state-in-effect
  }, [scanHeadings])

  // Calculate how many items fit in the container width using stored widths
  const calculateOverflow = useCallback(() => {
    if (!horizontal || !navRef.current) return

    const containerWidth = navRef.current.clientWidth
    const widths = itemWidthsRef.current

    if (widths.length === 0) return

    const headingWidth = headingRef.current?.offsetWidth || 0
    const totalItemsWidth = widths.reduce((a, b) => a + b, 0)

    if (headingWidth + totalItemsWidth <= containerWidth) {
      setVisibleCount(null)
      return
    }

    const overflowBtnWidth = overflowBtnRef.current?.offsetWidth ?? 80
    const available = containerWidth - overflowBtnWidth - headingWidth

    let sum = 0
    let count = 0
    for (const width of widths) {
      if (sum + width <= available) {
        sum += width
        count++
      } else {
        break
      }
    }

    setVisibleCount(Math.max(0, count))
  }, [horizontal])

  // Reset measurements when headings change so all items render for re-measurement
  const resetMeasurements = useCallback(() => {
    measuredRef.current = false
    itemWidthsRef.current = []
    setVisibleCount(null)
  }, [])

  useEffect(() => {
    resetMeasurements() // eslint-disable-line react-hooks/set-state-in-effect
  }, [headings, resetMeasurements])

  // Measure all item widths before paint, then calculate overflow.
  // Wrapped in useCallback so the direct call site in useLayoutEffect isn't a bare setState.
  const measureAndCalculate = useCallback(() => {
    if (!listRef.current || measuredRef.current) return
    const items = Array.from(listRef.current.querySelectorAll<HTMLLIElement>("[data-nav-item]"))
    if (items.length === 0 || items.length !== headings.length) return
    itemWidthsRef.current = items.map(item => item.offsetWidth)
    measuredRef.current = true
    calculateOverflow()
  }, [headings.length, calculateOverflow])

  useLayoutEffect(() => {
    if (!horizontal) return
    measureAndCalculate() // eslint-disable-line react-hooks/set-state-in-effect
  })

  // Recalculate on container resize using stored widths (no DOM re-measurement needed)
  useEffect(() => {
    if (!horizontal || !navRef.current) return

    const observer = new ResizeObserver(() => {
      if (itemWidthsRef.current.length > 0) calculateOverflow()
    })

    observer.observe(navRef.current)
    return () => observer.disconnect()
  }, [horizontal, calculateOverflow])

  if (headings.length === 0) return null

  const visibleHeadings = visibleCount !== null ? headings.slice(0, visibleCount) : headings
  const overflowHeadings = visibleCount !== null ? headings.slice(visibleCount) : []
  const hasOverflow = overflowHeadings.length > 0

  return (
    <div ref={navRef} {...props} className={cn("mb-40 text-16", props.className)}>
      <nav
        aria-labelledby="anchor-nav"
        className={cn("relative mx-auto items-center rounded-[0.3rem] border border-black-40 bg-black-10", {
          "flex w-fit rounded-full": horizontal,
        })}
      >
        {width && width < 768 && (
          <button
            ref={mobileButtonRef}
            id="anchor-nav"
            className="no-anchor m-0 flex items-center gap-6 p-10 pr-8 text-16 font-normal whitespace-nowrap hocus:underline"
            aria-expanded={mobileMenuOpen}
            aria-controls={mobilePanelId}
            onClick={toggleMobileMenu}
          >
            <OnThisPageIcon className="w-10 text-black-40" />
            On This Page
            <ChevronDownIcon
              width={24}
              aria-hidden
              className={cn("text-cardinal-red transition-transform duration-150", {"rotate-180": mobileMenuOpen})}
            />
          </button>
        )}
        {(!width || width >= 768) && (
          <div
            ref={headingRef}
            id="anchor-nav"
            className="m-0 flex items-center gap-8 p-10 pr-8 text-16 font-normal whitespace-nowrap"
          >
            <OnThisPageIcon className="w-10 text-black-40" />
            On This Page
          </div>
        )}
        <ul
          ref={listRef}
          id={mobilePanelId}
          className={cn("list-unstyled", {
            "flex flex-row flex-nowrap items-center": horizontal,
            "ml-28": !horizontal,
            hidden: width && width < 768 && !mobileMenuOpen,
            "absolute top-full left-0 z-10 block w-fit min-w-300 border-black-10 bg-white p-10 shadow-xl":
              width && width < 768 && mobileMenuOpen,
          })}
        >
          {(width && width < 768 ? headings : visibleHeadings).map(({id, text}) => (
            <li key={id} data-nav-item className="m-0">
              <a
                href={`#${id}`}
                onClick={closeMobileMenu}
                className={cn("nowrap block p-10 font-normal text-cardinal-red no-underline hocus:underline", {
                  "whitespace-nowrap": horizontal && width && width >= 768,
                })}
              >
                {text}
              </a>
            </li>
          ))}

          {/* Overflow button — always rendered when horizontal so its width can be measured */}
          {horizontal && width && width >= 768 && (
            <li
              ref={overflowContainerRef}
              className={cn("relative my-0 mr-0 ml-auto shrink-0 p-10", {
                "pointer-events-none invisible": !hasOverflow,
              })}
            >
              <button
                ref={overflowBtnRef}
                id={menuButtonId}
                aria-expanded={hasOverflow ? overflowOpen : undefined}
                aria-controls={hasOverflow ? menuPanelId : undefined}
                onClick={toggleOverflowOpen}
                className="flex items-center gap-4 whitespace-nowrap hocus:underline"
              >
                See More
                <ChevronDownIcon
                  width={24}
                  aria-hidden
                  className={cn("text-cardinal-red transition-transform duration-150", {"rotate-180": overflowOpen})}
                />
              </button>

              {width && width >= 768 && hasOverflow && overflowOpen && (
                <ul
                  id={menuPanelId}
                  aria-labelledby={menuButtonId}
                  className="absolute top-full right-0 z-10 m-0 min-w-48 list-none bg-white py-4 shadow-lg"
                >
                  {overflowHeadings.map(({id, text}) => (
                    <li key={id}>
                      <a
                        href={`#${id}`}
                        onClick={closeOverflow}
                        className={cn("block px-12 py-6 font-normal text-cardinal-red no-underline hocus:underline")}
                      >
                        {text}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          )}
        </ul>
      </nav>
    </div>
  )
}

export default AnchorNav
