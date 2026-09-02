import {getMenu} from "@lib/gql/gql-queries"
import SideNav from "@components/menu/side-nav"
import {HtmlHTMLAttributes, ReactNode} from "react"
import {BookLink, MenuAvailable, MenuItem} from "@lib/gql/__generated__/graphql"
import {getMenuActiveTrail} from "@lib/utils/utils"
import cn from "@lib/utils/className"

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  /**
   * Current url path.
   */
  currentPath?: string
  menuItems?: MenuItem[] | BookLink[]
  leftSideBar?: ReactNode | ReactNode[]
  hideSecondaryNav?: boolean
}

const InteriorPage = async ({children, leftSideBar, hideSecondaryNav, currentPath, menuItems, ...props}: Props) => {
  const menu = menuItems || (await getMenu(MenuAvailable.Main, 4))
  const activeTrail: string[] = getMenuActiveTrail(menu, currentPath)

  // Peel off the menu items from the parent.
  const topMenuItem = activeTrail.length > 0 ? menu.find(item => item.id === activeTrail[0]) : undefined
  const subTree = topMenuItem ? topMenuItem.children : []

  return (
    <div {...props} className={cn("centered flex flex-col gap-40 lg:flex-row", props.className)}>
      {(subTree.length > 1 || subTree[0]?.children || leftSideBar) && (
        <aside className="shrink-0 lg:w-1/4">
          {!hideSecondaryNav && (subTree.length > 1 || subTree[0]?.children) && (
            <>
              <a href="#page-content" className="skiplink">
                Skip secondary navigation
              </a>
              <SideNav menuItems={subTree} activeTrail={activeTrail} />
            </>
          )}
          {leftSideBar}
        </aside>
      )}

      <div id="page-content" className="min-w-0 grow">
        {children}
      </div>
    </div>
  )
}

export default InteriorPage
