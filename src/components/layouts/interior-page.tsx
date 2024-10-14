import {getMenu} from "@lib/gql/gql-queries"
import SideNav from "@components/menu/side-nav"
import {HtmlHTMLAttributes} from "react"
import {BookLink, MenuAvailable, MenuItem} from "@lib/gql/__generated__/drupal.d"
import {getMenuActiveTrail} from "@lib/drupal/utils"
import twMerge from "@lib/utils/twMerge"

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  /**
   * Current url path.
   */
  currentPath: string
  menuItems?: MenuItem[] | BookLink[]
}

const InteriorPage = async ({children, currentPath, menuItems, ...props}: Props) => {
  const menu = menuItems || (await getMenu(MenuAvailable.Main, 4))
  const activeTrail: string[] = getMenuActiveTrail(menu, currentPath)

  // Peel off the menu items from the parent.
  const topMenuItem = activeTrail.length > 0 ? menu.find(item => item.id === activeTrail[0]) : undefined
  const subTree = topMenuItem ? topMenuItem.children : []

  return (
    <div {...props} className={twMerge("centered flex gap-20", props.className)}>
      {(subTree.length > 1 || subTree[0]?.children) && (
        <aside className="hidden w-1/4 shrink-0 lg:block">
          <a href="#page-content" className="skiplink">
            Skip secondary navigation
          </a>
          <SideNav menuItems={subTree} activeTrail={activeTrail} />
        </aside>
      )}

      <div id="page-content" className="flex-grow">
        {children}
      </div>
    </div>
  )
}

export default InteriorPage
