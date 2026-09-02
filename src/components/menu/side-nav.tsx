"use client"

import Link from "@components/elements/link"
import {BookLink, MenuItem as MenuItemType} from "@lib/gql/__generated__/graphql"
import {HTMLAttributes, RefObject, useEffect, useId, useRef} from "react"
import cn from "@lib/utils/className"
import {useBoolean, useEventListener} from "usehooks-ts"
import {usePathname} from "next/navigation"
import useOutsideClick from "@hooks/useOutsideClick"
import Hamburger from "@components/menu/hamburger"

type Props = HTMLAttributes<HTMLElement> & {
  /**
   * Array of nested menu items.
   */
  menuItems: MenuItemType[] | BookLink[]
  /**
   * The trail of the current page within the menu items.
   */
  activeTrail: string[]
}

const SideNav = ({menuItems, activeTrail, ...props}: Props) => {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const {value: menuOpen, setFalse: closeMenu, toggle: toggleMenu} = useBoolean(false)
  const browserUrl = usePathname()
  const id = useId()
  useOutsideClick(menuRef, closeMenu)
  useEffect(() => closeMenu(), [browserUrl, closeMenu])

  const handleEscape = (event: KeyboardEvent) => {
    if (event.key !== "Escape" || !menuOpen) return

    closeMenu()
    buttonRef.current?.focus()
  }
  useEventListener("keydown", handleEscape, menuRef as RefObject<HTMLDivElement>)

  return (
    <nav aria-labelledby={`${id}-label`} ref={menuRef} {...props} className={cn("relative mb-20", props.className)}>
      <Hamburger
        ref={buttonRef}
        className="group flex w-full items-center justify-between border border-black-20 p-10 lg:hidden"
        onClick={toggleMenu}
        open={menuOpen}
        aria-expanded={menuOpen}
        aria-label={menuOpen ? "Close Secondary Navigation Menu" : "Open Secondary Navigation Menu"}
        aria-controls={id}
      >
        <span id={`${id}-label`} className="order-first font-semibold group-hocus:underline">
          Section Menu
        </span>
      </Hamburger>

      <div
        id={id}
        className={cn(
          "absolute top-full left-0 z-10 hidden w-full rounded-xl border border-black-20 bg-white p-20 shadow-2xl lg:relative lg:block lg:border-0 lg:p-0 lg:shadow-none",
          {
            block: menuOpen,
          }
        )}
      >
        <ul className="list-unstyled">
          {menuItems.map(item => (
            <MenuItem key={`sidenav--${item.id}`} {...item} activeTrail={activeTrail} level={0} />
          ))}
        </ul>
      </div>
    </nav>
  )
}

type MenuItemProps = (MenuItemType | BookLink) & {
  activeTrail: string[]
  level: number
}

const MenuItem = ({id, url, title, children, activeTrail, level, expanded}: MenuItemProps) => (
  <li className="m-0 border-b p-0 last:border-0">
    <Link
      href={url || "#"}
      className={cn("relative inline-block w-full py-10 pl-20 font-normal no-underline hocus:underline", {
        // Non-active state.
        "text-digital-red before:scale-y-[1] before:transition hocus:text-black hocus:before:absolute hocus:before:top-0 hocus:before:left-0 hocus:before:block hocus:before:h-full hocus:before:w-6 hocus:before:bg-black hocus:before:content-['']":
          activeTrail.at(-1) !== id,
        // Active state.
        "text-black before:absolute before:top-0 before:left-0 before:block before:h-full before:w-6 before:bg-black before:content-['']":
          activeTrail.at(-1) === id,
      })}
      aria-current={activeTrail.at(-1) === id ? "page" : undefined}
    >
      {title}
    </Link>
    {expanded && children && children.length > 0 && activeTrail.includes(id) && (
      <ul
        className={cn("list-unstyled border-t", {
          "pl-20": level === 0,
          "pl-40": level === 1,
          "pl-56": level === 2,
          "pl-96": level === 3,
        })}
      >
        {children.map(item => (
          <MenuItem key={item.id} {...item} level={level + 1} activeTrail={activeTrail} />
        ))}
      </ul>
    )}
  </li>
)

export default SideNav
