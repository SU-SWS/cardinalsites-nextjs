import Link from "@components/elements/link";
import {clsx} from "clsx";
import {MenuItem as MenuItemType} from "@lib/gql/__generated__/drupal.d";

const SideNav = ({menuItems, activeTrail}: { menuItems: MenuItemType[], activeTrail: string[] }) => {
  return (
    <nav aria-label="Secondary Navigation">
      <ul className="list-unstyled">
        {menuItems.map(item =>
          <MenuItem key={`sidenav--${item.id}`} {...item} activeTrail={activeTrail} level={0}/>
        )}
      </ul>
    </nav>
  )
}

type MenuItemProps = MenuItemType & {
  activeTrail: string[]
  level: number
}

const MenuItem = ({id, url, title, children, activeTrail, level}: MenuItemProps) => {
  // Need to list them out each so tailwind will include each for styling.
  const leftPadding = [
    'pl-10',
    'pl-20',
    'pl-28',
    'pl-48',
  ]

  const linkClasses = clsx(
    // Normal styles.
    'w-full inline-block relative no-underline hocus:underline pl-10 py-5',
    {
      // Non-active state.
      'text-digital-red hocus:text-black hocus:before:content-[""] hocus:before:block hocus:before:w-[6px] hocus:before:h-full hocus:before:bg-black hocus:before:absolute hocus:before:left-0 hocus:before:top-0 before:scale-y-[1] before:transition': activeTrail.at(-1) !== id,
      // Active state.
      'text-black before:content-[""] before:block before:w-[6px] before:h-full before:bg-black before:absolute before:left-0 before:top-0': activeTrail.at(-1) === id
    }
  )

  return (
    <li className="m-0 p-0 border-b last:border-0">
      <Link
        href={url || '#'}
        className={linkClasses}
        aria-current={activeTrail.at(-1) === id ? "true" : undefined}
      >
        {title}
      </Link>
      {(children && children.length > 0 && activeTrail.includes(id)) &&
        <ul className={`border-t list-unstyled ${leftPadding[level]}`}>
          {children.map(item =>
            <MenuItem key={item.id} {...item} level={level + 1} activeTrail={activeTrail}/>
          )}
        </ul>
      }
    </li>
  )
}

export default SideNav;