import Link from "@components/elements/link"
import {clsx} from "clsx"
import {MenuItem as MenuItemType} from "@lib/gql/__generated__/drupal.d"
import {HTMLAttributes} from "react"
import twMerge from "@lib/utils/twMerge"

type Props = HTMLAttributes<HTMLElement> & {
  /**
   * Array of nested menu items.
   */
  menuItems: MenuItemType[]
  /**
   * The trail of the current page within the menu items.
   */
  activeTrail: string[]
}

const SideNav = ({menuItems, activeTrail, ...props}: Props) => {
  return (
    <nav aria-label="Secondary Navigation" {...props}>
      <ul className="list-unstyled">
        {menuItems.map(item => (
          <MenuItem key={`sidenav--${item.id}`} {...item} activeTrail={activeTrail} level={0} />
        ))}
      </ul>
    </nav>
  )
}

type MenuItemProps = MenuItemType & {
  activeTrail: string[]
  level: number
}

const MenuItem = ({id, url, title, children, activeTrail, level, expanded}: MenuItemProps) => {
  const linkClasses = twMerge(
    "w-full inline-block relative no-underline hocus:underline pl-10 py-5",
    clsx({
      // Non-active state.
      "text-digital-red hocus:text-black hocus:before:content-[''] hocus:before:block hocus:before:w-[6px] hocus:before:h-full hocus:before:bg-black hocus:before:absolute hocus:before:left-0 hocus:before:top-0 before:scale-y-[1] before:transition":
        activeTrail.at(-1) !== id,
      // Active state.
      "text-black before:content-[''] before:block before:w-[6px] before:h-full before:bg-black before:absolute before:left-0 before:top-0":
        activeTrail.at(-1) === id,
    })
  )

  return (
    <li className="m-0 border-b p-0 last:border-0">
      <Link href={url || "#"} className={linkClasses} aria-current={activeTrail.at(-1) === id ? "true" : undefined}>
        {title}
      </Link>
      {expanded && children && children.length > 0 && activeTrail.includes(id) && (
        <ul
          className={twMerge(
            "list-unstyled border-t",
            clsx({
              "pl-10": level === 0,
              "pl-20": level === 1,
              "pl-28": level === 2,
              "pl-48": level === 3,
            })
          )}
        >
          {children.map(item => (
            <MenuItem key={item.id} {...item} level={level + 1} activeTrail={activeTrail} />
          ))}
        </ul>
      )}
    </li>
  )
}

export default SideNav
