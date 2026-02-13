"use client"

import {useIsClient, useWindowSize} from "usehooks-ts"
import {HTMLAttributes, useEffect, useLayoutEffect, useRef, useState} from "react"
import useAccordion from "@hooks/useAccordion"
import {ChevronDownIcon} from "@heroicons/react/20/solid"
import {clsx} from "clsx"
import twMerge from "@lib/utils/twMerge"
import useOutsideClick from "@hooks/useOutsideClick"

type Props = {
  horizontal?: boolean
}

const AnchorNav = ({horizontal}: Props) => {
  const isClient = useIsClient()
  if (!isClient) return null

  const headings = Array.from(document.querySelectorAll("main h2[id]"))
  const links = headings
    .filter(heading => heading.getAttribute("id"))
    .map(heading => ({
      id: heading.getAttribute("id") ?? "",
      label: heading.textContent?.trim() ?? "",
    }))

  if (!links.length) return null
  if (horizontal) return <HorizontalNav links={links} />
  return <VerticalNav links={links} />
}

type NavProps = {links: Array<{id: string; label: string}>}
const HorizontalNav = ({links}: NavProps) => {
  const [visibleLinks, setVisibleLinks] = useState<NavProps["links"]>([...links])

  const {width = 0} = useWindowSize({initializeWithValue: false, debounceDelay: 100})
  const {buttonProps, panelProps, collapseAccordion, expanded} = useAccordion()
  const ref = useRef<HTMLDivElement>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)
  useOutsideClick(ref, collapseAccordion)

  const checkOverflow = () => {
    if (!ref.current || !sentinelRef.current) return

    const containerWidth = ref.current.offsetWidth
    const sentinelOffsetLeft = sentinelRef.current.offsetLeft

    // If the sentinel (last element) is outside the container's right edge, we have overflow
    if (sentinelOffsetLeft > containerWidth) {
      // Remove the last item and re-check on the next render
      setVisibleLinks(prevItems => prevItems.slice(0, -1))
    }
  }

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => checkOverflow(), [width])
  useLayoutEffect(() => {
    setTimeout(checkOverflow, 1000)
  }, [])

  const overflowLinks =
    visibleLinks.length !== links.length ? [...links].slice(0 - (links.length - visibleLinks.length)) : []

  return (
    <div className="centered" ref={ref}>
      <nav className="relative mb-20 w-full border-black-40 lg:mx-auto lg:flex lg:w-fit lg:items-center lg:gap-10 lg:rounded-xl lg:border lg:bg-black-10 lg:p-10">
        {width >= 992 && (
          <h2 className="m-0 flex items-center gap-4 whitespace-nowrap p-0 text-4xl font-normal">
            <OnThisPageIcon className="w-10" />
            On This Page
          </h2>
        )}
        {width < 992 && (
          <button
            className="w-full rounded-full border border-black-40 bg-black-10 p-5 hocus:underline"
            {...buttonProps}
          >
            <h2 className="m-0 mx-auto flex w-fit items-center gap-4 text-4xl font-normal">
              <OnThisPageIcon className="w-10" />
              On This Page
              <ChevronDownIcon
                width={40}
                className={clsx("text-cardinal-red transition-all", {"rotate-180": expanded})}
              />
            </h2>
          </button>
        )}

        <div
          {...panelProps}
          className={twMerge(
            "absolute left-0 top-full mt-10 w-full rounded-xl border border-black-40 bg-black-10 p-10 lg:relative lg:mt-0 lg:border-0 lg:bg-transparent lg:p-0",
            clsx({
              hidden: !expanded && width < 992,
              block: expanded,
            })
          )}
        >
          <ul className="list-unstyled lg:flex lg:items-center lg:gap-10">
            {(width < 992 ? links : visibleLinks).map(link => (
              <li key={link.id} className="m-0 p-0">
                <a
                  className="text-digital-red no-underline hocus:text-digital-red-light hocus:underline lg:whitespace-nowrap"
                  href={`#${link.id}`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        {width >= 992 && <OverflowLinks links={overflowLinks} />}
        <div ref={sentinelRef} />
      </nav>
    </div>
  )
}
const OverflowLinks = ({links}: NavProps) => {
  const {buttonProps, panelProps, collapseAccordion} = useAccordion()
  const ref = useRef<HTMLDivElement>(null)
  useOutsideClick(ref, collapseAccordion)
  if (links.length === 0) return null
  return (
    <div className="relative" ref={ref}>
      <button {...buttonProps} className="whitespace-nowrap hocus:underline">
        See More
      </button>
      <ul
        {...panelProps}
        className={twMerge(
          "list-unstyled absolute right-0 top-full mt-10 rounded-xl border border-black-50 bg-white p-10",
          panelProps.className
        )}
      >
        {links.map(link => (
          <li key={link.id}>
            <a
              href={`#${link.id}`}
              className="text-digital-red no-underline hocus:text-digital-red-light hocus:underline"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

const VerticalNav = ({links}: NavProps) => {
  const {width = 0} = useWindowSize({initializeWithValue: false})
  const {buttonProps, panelProps, collapseAccordion, expanded} = useAccordion()
  const ref = useRef<HTMLElement>(null)
  useOutsideClick(ref, collapseAccordion)
  return (
    <nav className="relative border-black-40 lg:rounded-xl lg:border lg:bg-black-10 lg:p-10" ref={ref}>
      {width >= 992 && (
        <h2 className="gap-4text-4xl flex items-center font-normal">
          <OnThisPageIcon className="w-10" />
          On This Page
        </h2>
      )}
      {width < 992 && (
        <button className="w-full rounded-full border border-black-40 bg-black-10 p-5 hocus:underline" {...buttonProps}>
          <h2 className="m-0 mx-auto flex w-fit items-center gap-4 text-4xl font-normal">
            <OnThisPageIcon className="w-10" />
            On This Page
            <ChevronDownIcon
              width={40}
              className={clsx("text-cardinal-red transition-all", {"rotate-180": expanded})}
            />
          </h2>
        </button>
      )}

      <div
        {...panelProps}
        className={twMerge(
          "absolute left-0 top-full mt-10 w-full rounded-xl border border-black-40 bg-black-10 p-10 lg:relative lg:mt-0 lg:border-0 lg:bg-transparent lg:p-0",
          clsx({
            hidden: !expanded && width < 992,
            block: expanded,
          })
        )}
      >
        <ul className="list-unstyled">
          {links.map(link => (
            <li key={link.id}>
              <a
                className="text-digital-red no-underline hocus:text-digital-red-light hocus:underline"
                href={`#${link.id}`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}

const OnThisPageIcon = ({...props}: HTMLAttributes<HTMLOrSVGElement>) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path
        fillRule="evenodd"
        d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75H12a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z"
        clipRule="evenodd"
      />
    </svg>
  )
}

export default AnchorNav
