import Link from "@components/elements/link"
import {BookLink, MenuItem as MenuItemType} from "@lib/gql/__generated__/graphql"
import {HTMLAttributes} from "react"
import cn from "@lib/utils/className"

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
  return (
    <nav aria-label="Secondary Navigation" {...props} className={cn("mb-20", props.className)}>
      <ul className="list-unstyled">
        {menuItems.map(item => (
          <MenuItem key={`sidenav--${item.id}`} {...item} activeTrail={activeTrail} level={0} />
        ))}
      </ul>
    </nav>
  )
}

type MenuItemProps = (MenuItemType | BookLink) & {
  activeTrail: string[]
  level: number
}

const MenuItem = ({id, url, title, children, activeTrail, level, expanded}: MenuItemProps) => {
  const linkClasses = cn("relative inline-block w-full py-10 pl-20 font-normal no-underline hocus:underline", {
    // Non-active state.
    "text-digital-red before:scale-y-[1] before:transition hocus:text-black hocus:before:absolute hocus:before:top-0 hocus:before:left-0 hocus:before:block hocus:before:h-full hocus:before:w-6 hocus:before:bg-black hocus:before:content-['']":
      activeTrail.at(-1) !== id,
    // Active state.
    "text-black before:absolute before:top-0 before:left-0 before:block before:h-full before:w-6 before:bg-black before:content-['']":
      activeTrail.at(-1) === id,
  })

  return (
    <li className="m-0 border-b p-0 last:border-0">
      <Link href={url || "#"} className={linkClasses} aria-current={activeTrail.at(-1) === id ? "page" : undefined}>
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
}

export default SideNav
