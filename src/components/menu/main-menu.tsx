import {getConfigPageField, getMenu} from "@lib/gql/gql-queries"
import {MenuAvailable, MenuItem as MenuItemType, StanfordBasicSiteSetting} from "@lib/gql/__generated__/drupal.d"
import twMerge from "@lib/utils/twMerge"
import {clsx} from "clsx"
import SiteSearchForm from "@components/search/site-search-form"
import {
  MainMenuClientWrapper,
  MainMenuItemClientLink,
  MainMenuItemClientWrapper,
} from "@components/menu/main-menu.client"
import Link from "@components/elements/link"

const MainMenu = async () => {
  const menuItems = await getMenu(MenuAvailable.Main, 3)
  const headerLinks = await getConfigPageField<StanfordBasicSiteSetting, StanfordBasicSiteSetting["suSiteHeaderLinks"]>(
    "StanfordBasicSiteSetting",
    "suSiteHeaderLinks"
  )

  return (
    <MainMenuClientWrapper aria-label="Main Navigation" className="lg:centered">
      <SiteSearchForm className="px-10 lg:hidden" />
      {headerLinks?.[0].url && (
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
        "relative m-0 grid grid-cols-10 items-center justify-between border-b border-cool-grey py-2 first:border-t last:border-0 lg:relative lg:border-black-20 lg:py-0 lg:pr-5",
        clsx({"first:border-t-0 lg:flex lg:border-b-0 last:lg:pr-0": level === 0, "lg:first:border-t-0": level === 1})
      )}
      link={
        <>
          <MainMenuItemClientLink
            id={id}
            href={url || "#"}
            className={twMerge(
              "col-start-1 col-end-9 border-l-[6px] border-transparent py-5 text-white no-underline transition-all hocus:text-white hocus-visible:border-white hocus-visible:underline lg:text-digital-red lg:hocus:text-black",
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
          {level === 0 && <span className="mb-[6px] ml-5 hidden h-[25px] w-[1px] bg-archway-light lg:block" />}
        </>
      }
    >
      {children.length > 0 && (
        <ul
          className={twMerge(
            "list-unstyled col-span-10 w-full min-w-[300px] px-0 lg:bg-white",
            clsx({
              "lg:absolute lg:right-0 lg:top-full lg:shadow-2xl": level === 0,
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
