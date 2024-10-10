import {getMenu} from "@lib/gql/gql-queries"
import {MenuAvailable, MenuItem as MenuItemType} from "@lib/gql/__generated__/drupal.d"
import twMerge from "@lib/utils/twMerge"
import {clsx} from "clsx"
import SiteSearchForm from "@components/search/site-search-form"
import {
  MainMenuClientWrapper,
  MainMenuItemClientLink,
  MainMenuItemClientWrapper,
} from "@components/menu/main-menu.client"

const MainMenu = async () => {
  const menuItems = await getMenu(MenuAvailable.Main, 3)

  return (
    <MainMenuClientWrapper aria-label="Main Navigation" className="lg:centered">
      <SiteSearchForm className="px-10 lg:hidden" />
      <ul className="list-unstyled m-0 flex-wrap p-0 lg:flex lg:justify-end">
        {menuItems.map(item => (
          <MenuItem key={item.id} {...item} level={0} />
        ))}
      </ul>
    </MainMenuClientWrapper>
  )
}

type MenuItemProps = MenuItemType & {
  level: number
}

const MenuItem = ({id, url, title, children, level}: MenuItemProps) => {
  return (
    <MainMenuItemClientWrapper
      id={id}
      level={level}
      className={twMerge(
        "relative m-0 grid grid-cols-4-1 flex-wrap items-center justify-between border-b border-cool-grey py-2 first:border-t last:border-0 lg:relative lg:flex lg:border-black-20 lg:py-0 lg:pr-5 last:lg:pr-0",
        clsx({"first:border-t-0 lg:border-b-0": level === 0, "lg:first:border-t-0": level === 1})
      )}
      link={
        <>
          <MainMenuItemClientLink
            level={level}
            id={id}
            href={url || "#"}
            className={twMerge(
              "flex-grow border-l-[6px] border-transparent py-5 text-white no-underline transition-all hocus:text-white hocus-visible:border-white hocus-visible:underline lg:text-digital-red lg:hocus:text-black",
              clsx({
                "ml-5 pl-10 aria-current-page:border-digital-red data-intrail:border-transparent lg:ml-0 lg:border-b-[6px] lg:border-l-0 lg:pb-2 lg:pl-0 lg:aria-current-page:border-black lg:data-intrail:border-foggy-dark":
                  level === 0,
                "pl-20 aria-current-page:border-digital-red lg:pl-5 lg:hocus-visible:border-black-true": level === 1,
                "pl-28 aria-current-page:border-digital-red lg:pl-10 lg:hocus-visible:border-black-true": level === 2,
                "pl-48 aria-current-page:border-digital-red lg:pl-20 lg:hocus-visible:border-black-true": level === 3,
                "ml-5 aria-current-page:border-digital-red lg:ml-0 lg:hocus-visible:border-black-true": level !== 0,
              })
            )}
          >
            {title}
          </MainMenuItemClientLink>
          {level === 0 && <span className="mb-[6px] ml-5 hidden h-[25px] w-[1px] shrink-0 bg-archway-light lg:block" />}
        </>
      }
    >
      {children.length > 0 && (
        <ul
          className={twMerge(
            "list-unstyled col-span-2 w-full min-w-[300px] px-0 lg:bg-white",
            clsx({
              "z-[1] lg:absolute lg:left-0 lg:right-full lg:top-full lg:shadow-2xl": level === 0,
              "z-[2]": level === 1,
              "z-[3]": level === 2,
              "z-[4]": level === 3,
              "z-[5]": level === 4,
              "lg:top-0": level !== 0,
            })
          )}
        >
          {children.map(item => (
            <MenuItem key={item.id} {...item} level={level + 1} />
          ))}
        </ul>
      )}
    </MainMenuItemClientWrapper>
  )
}

export default MainMenu
