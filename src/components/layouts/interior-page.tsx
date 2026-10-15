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

const InteriorPage = ({children, leftSideBar, hideSecondaryNav, currentPath, menuItems, ...props}: Props) => (
  <div {...props} className={cn("centered flex flex-col gap-40 lg:flex-row", props.className)}>
    {/* The menu lookup lives in its own component, so the page content renders alongside it instead of waiting. */}
    <InteriorSideBar hideSecondaryNav={hideSecondaryNav} currentPath={currentPath} menuItems={menuItems}>
      {leftSideBar}
    </InteriorSideBar>

    <div id="page-content" className="min-w-0 grow">
      {children}
    </div>
  </div>
)

const InteriorSideBar = async ({
  children,
  hideSecondaryNav,
  currentPath,
  menuItems,
}: Pick<Props, "children" | "hideSecondaryNav" | "currentPath" | "menuItems">) => {
  const menu = menuItems || (await getMenu(MenuAvailable.Main, 4))
  const activeTrail: string[] = getMenuActiveTrail(menu, currentPath)

  // Peel off the menu items from the parent.
  const topMenuItem = !!activeTrail.length ? menu.find(item => item.id === activeTrail[0]) : undefined
  const subTree = topMenuItem ? topMenuItem.children : []

  if (!(subTree.length > 1 || subTree[0]?.children || children)) return null

  return (
    <aside className="shrink-0 lg:w-1/4">
      {!hideSecondaryNav && (subTree.length > 1 || subTree[0]?.children) && (
        <>
          <a href="#page-content" className="skiplink">
            Skip secondary navigation
          </a>
          <SideNav menuItems={subTree} activeTrail={activeTrail} />
        </>
      )}
      {children}
    </aside>
  )
}

export default InteriorPage
