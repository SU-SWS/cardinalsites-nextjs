"use client"

import useOutsideClick from "@hooks/useOutsideClick"
import {ChevronDownIcon} from "@heroicons/react/20/solid"
import {useBoolean, useEventListener} from "usehooks-ts"
import {RefObject, useCallback, useEffect, useRef} from "react"
import {usePathname} from "next/navigation"
import cn from "@lib/utils/className"
import Link from "@components/elements/link"
import SiteSearchForm from "@components/search/site-search-form"
import {MenuItem as MenuItemType, StanfordBasicSiteSetting} from "@lib/gql/__generated__/graphql"

type Props = {
  hideSearch?: boolean
  menuItems: MenuItemType[]
  headerLinks?: StanfordBasicSiteSetting["suSiteHeaderLinks"]
}

const MainMenuClient = ({hideSearch, menuItems, headerLinks}: Props) => {
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
  useEventListener("keydown", handleEscape, menuRef as RefObject<HTMLDivElement>)

  return (
    <nav aria-label="Main Navigation" className="lg:centered" ref={menuRef}>
      <button
        ref={buttonRef}
        className="group absolute right-10 top-5 flex flex-col items-center lg:hidden"
        onClick={toggleMenu}
        aria-expanded={menuOpen}
        aria-label={menuOpen ? "Close Main Navigation Menu" : "Open Main Navigation Menu"}
      >
        <span className="flex h-[30px] w-[30px] flex-col items-center justify-center">
          <span
            className={cn("block h-[3px] w-full rounded-sm bg-black-true transition-all duration-300 ease-out", {
              "translate-y-4 rotate-45": menuOpen,
              "-translate-y-0.5": !menuOpen,
            })}
          />
          <span
            className={cn("my-3 block h-[3px] w-full rounded-sm bg-black-true transition-all duration-300 ease-out", {
              "opacity-0": menuOpen,
              "opacity-100": !menuOpen,
            })}
          />
          <span
            className={cn("block h-[3px] w-full rounded-sm bg-black-true transition-all duration-300 ease-out", {
              "-translate-y-4 -rotate-45": menuOpen,
              "translate-y-0.5": !menuOpen,
            })}
          />
        </span>
        <span className="group-hocus-visible:underline" aria-hidden="true">
          {menuOpen ? "Close" : "Menu"}
        </span>
      </button>
      <div
        className={cn("top-100 absolute z-20 hidden w-full bg-black lg:relative lg:top-0 lg:block lg:bg-transparent", {
          block: menuOpen,
        })}
      >
        {!hideSearch && <SiteSearchForm className="px-10 lg:hidden" />}
        {headerLinks?.[0]?.url && (
          <ul className="list-unstyled mx-auto flex w-fit flex-wrap gap-10 pl-16 pt-5 lg:hidden">
            {headerLinks.map((link, i) => (
              <li key={`utility-link-${i}`}>
                <Link className="text-white no-underline hocus:text-white hocus:underline" href={link.url as string}>
                  {link.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
        <ul className="list-unstyled m-0 flex-wrap p-0 lg:flex lg:justify-end">
          {menuItems.map(item => (
            <MenuItem key={item.id} {...item} level={0} />
          ))}
        </ul>
      </div>
    </nav>
  )
}

type MenuItemProps = MenuItemType & {
  level: number
}

const MenuItem = ({id, url, title, children, level}: MenuItemProps) => {
  const menuItemRef = useRef<HTMLLIElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const {value: submenuOpen, setFalse: closeSubmenu, toggle: toggleSubmenu} = useBoolean(false)
  const browserUrl = usePathname()
  const href = url || "#"
  const isCurrent = href === browserUrl

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

  useEventListener("keydown", handleEscape, menuItemRef as unknown as RefObject<HTMLDivElement>)

  return (
    <li
      ref={menuItemRef}
      className={cn(
        "relative m-0 grid grid-cols-10 items-center justify-between border-b border-cool-grey py-2 first:border-t last:border-0 lg:relative lg:border-black-20 lg:py-0 lg:pr-5",
        {"first:border-t-0 lg:flex lg:border-b-0 last:lg:pr-0": level === 0, "lg:first:border-t-0": level === 1}
      )}
    >
      <Link
        prefetch={level === 0}
        href={href}
        data-intrail={!isCurrent && browserUrl.includes(href) && href !== "/"}
        aria-current={isCurrent ? "page" : undefined}
        className={cn(
          "col-start-1 col-end-9 border-l-[6px] border-transparent py-5 text-white no-underline transition-all hocus:text-white hocus-visible:border-white hocus-visible:underline lg:text-digital-red lg:hocus:text-black",
          {
            "ml-5 pl-10 aria-current-page:border-digital-red data-intrail:border-transparent lg:ml-0 lg:border-b-[6px] lg:border-l-0 lg:pb-2 lg:pl-0 lg:aria-current-page:border-black lg:data-intrail:border-foggy-dark":
              level === 0,
            "pl-20 aria-current-page:border-digital-red lg:pl-5 lg:hocus-visible:border-black-true": level === 1,
            "pl-28 aria-current-page:border-digital-red lg:pl-10 lg:hocus-visible:border-black-true": level === 2,
            "pl-48 aria-current-page:border-digital-red lg:pl-20 lg:hocus-visible:border-black-true": level === 3,
            "ml-5 aria-current-page:border-digital-red lg:ml-0 lg:hocus-visible:border-black-true": level !== 0,
          }
        )}
      >
        {title}
      </Link>
      {level === 0 && !!children.length && (
        <span className="mb-[6px] ml-5 hidden h-[25px] w-[1px] bg-archway-light lg:block" />
      )}

      {!!children.length && (
        <>
          <button
            aria-labelledby={id}
            className="group relative right-10 col-start-10 w-fit shrink-0 rounded-full border-b border-transparent bg-digital-red text-white hocus-visible:border-black hocus-visible:bg-white lg:right-0 lg:rounded-none lg:bg-transparent lg:text-digital-red"
            ref={buttonRef}
            onClick={toggleSubmenu}
            aria-expanded={submenuOpen}
          >
            <ChevronDownIcon
              height={35}
              className={cn(
                "ml-auto transition duration-150 ease-in-out group-hocus-visible:scale-125 group-hocus-visible:text-black",
                {"rotate-180": submenuOpen}
              )}
            />
          </button>

          {submenuOpen && (
            <ul
              className={cn("list-unstyled col-span-10 w-full min-w-[300px] px-0 lg:bg-white", {
                "lg:absolute lg:right-0 lg:top-full lg:shadow-2xl": level === 0,
                "lg:top-0": level !== 0,
              })}
            >
              {children.map(item => (
                <MenuItem key={item.id} {...item} level={level + 1} />
              ))}
            </ul>
          )}
        </>
      )}
    </li>
  )
}

export default MainMenuClient
