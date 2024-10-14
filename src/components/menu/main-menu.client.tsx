"use client"

import useOutsideClick from "@lib/hooks/useOutsideClick"
import {ChevronDownIcon} from "@heroicons/react/20/solid"
import {clsx} from "clsx"
import {useBoolean, useEventListener} from "usehooks-ts"
import {HTMLAttributes, ReactNode, useCallback, useEffect, useRef} from "react"
import {usePathname} from "next/navigation"
import twMerge from "@lib/utils/twMerge"
import Link, {LinkProps} from "@components/elements/link"

export const MainMenuClientWrapper = ({children, ...props}: HTMLAttributes<HTMLUListElement>) => {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const {value: menuOpen, setFalse: closeMenu, toggle: toggleMenu} = useBoolean(false)
  const browserUrl = usePathname()

  useOutsideClick(menuRef, closeMenu)

  const handleEscape = useCallback(
    (event: KeyboardEvent) => {
      if (event.key !== "Escape" || !menuOpen) return

      closeMenu()
      buttonRef.current?.focus()
    },
    [menuOpen, closeMenu]
  )

  useEffect(() => closeMenu(), [browserUrl, closeMenu])
  useEventListener("keydown", handleEscape, menuRef)

  return (
    <nav {...props} ref={menuRef}>
      <button
        ref={buttonRef}
        className="group absolute right-10 top-5 flex flex-col items-center lg:hidden"
        onClick={toggleMenu}
        aria-expanded={menuOpen}
        aria-label={menuOpen ? "Close Main Navigation Menu" : "Open Main Navigation Menu"}
      >
        <span className="flex h-[30px] w-[30px] flex-col items-center justify-center">
          <span
            className={twMerge(
              "block h-[3px] w-full rounded-sm bg-black-true transition-all duration-300 ease-out",
              clsx({
                "translate-y-4 rotate-45": menuOpen,
                "-translate-y-0.5": !menuOpen,
              })
            )}
          />
          <span
            className={twMerge(
              "my-3 block h-[3px] w-full rounded-sm bg-black-true transition-all duration-300 ease-out",
              clsx({
                "opacity-0": menuOpen,
                "opacity-100": !menuOpen,
              })
            )}
          />
          <span
            className={twMerge(
              "block h-[3px] w-full rounded-sm bg-black-true transition-all duration-300 ease-out",
              clsx({
                "-translate-y-4 -rotate-45": menuOpen,
                "translate-y-0.5": !menuOpen,
              })
            )}
          />
        </span>
        <span className="group-hocus-visible:underline" aria-hidden>
          {menuOpen ? "Close" : "Menu"}
        </span>
      </button>
      <div
        className={twMerge(
          "top-100 absolute z-20 hidden w-full bg-black lg:relative lg:block lg:bg-transparent",
          clsx({block: menuOpen})
        )}
      >
        {children}
      </div>
    </nav>
  )
}

type ItemProps = HTMLAttributes<HTMLLIElement> & {
  level: number
  link: ReactNode
}

export const MainMenuItemClientWrapper = ({id, level, link, children, ...props}: ItemProps) => {
  const menuItemRef = useRef<HTMLLIElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const {value: submenuOpen, setFalse: closeSubmenu, toggle: toggleSubmenu} = useBoolean(false)
  const browserUrl = usePathname()

  useOutsideClick(menuItemRef, closeSubmenu)

  // Close the submenu if the url changes.
  useEffect(() => closeSubmenu(), [browserUrl, closeSubmenu])

  // If the user presses escape on the keyboard, close the submenus.
  const handleEscape = useCallback(
    (event: KeyboardEvent) => {
      if (event.key !== "Escape" || !submenuOpen) return

      closeSubmenu()
      if (level === 0) buttonRef.current?.focus()
    },
    [level, submenuOpen, closeSubmenu]
  )

  useEventListener("keydown", handleEscape, menuItemRef)

  return (
    <li {...props} ref={menuItemRef}>
      {link}

      {children && (
        <>
          <span className="ml-auto flex items-center">
            <button
              aria-labelledby={id}
              className="group relative right-10 shrink-0 rounded-full border-b border-transparent bg-digital-red text-white hocus-visible:border-black hocus-visible:bg-white lg:right-0 lg:rounded-none lg:bg-transparent lg:text-digital-red"
              ref={buttonRef}
              onClick={toggleSubmenu}
              aria-expanded={submenuOpen}
            >
              <ChevronDownIcon
                height={35}
                className={twMerge(
                  "transition duration-150 ease-in-out group-hocus-visible:scale-125 group-hocus-visible:text-black",
                  clsx({
                    "rotate-180": submenuOpen,
                  })
                )}
              />
            </button>
          </span>
          {submenuOpen && children}
        </>
      )}
    </li>
  )
}

type LinkItemProps = LinkProps & {
  level: number
}
export const MainMenuItemClientLink = ({href, children, ...props}: LinkItemProps) => {
  const currentPath = usePathname()
  const isCurrent = href === currentPath

  return (
    <Link
      {...props}
      href={href}
      data-intrail={!isCurrent && currentPath.includes(href)}
      aria-current={isCurrent ? "page" : undefined}
    >
      {children}
    </Link>
  )
}
