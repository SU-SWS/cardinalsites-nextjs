import {getMenu} from "@lib/gql/gql-queries";
import SideNav from "@components/menu/side-nav";
import {HtmlHTMLAttributes} from "react";
import {isDraftMode} from "@lib/drupal/utils";
import {MenuAvailable} from "@lib/gql/__generated__/drupal.d";
import useActiveTrail from "@lib/hooks/useActiveTrail";

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  currentPath: string
}

const InteriorPage = async ({children, currentPath, ...props}: Props) => {
  const menu = await getMenu(MenuAvailable.Main, isDraftMode());
  const activeTrail: string[] = useActiveTrail(menu, currentPath);

  // Peel off the menu items from the parent.
  const topMenuItem = activeTrail.length > 0 ? menu.find(item => item.id === activeTrail[0]) : undefined;
  const subTree = topMenuItem ? topMenuItem.children : [];

  return (
    <div className="centered flex gap-20" {...props}>

      {(subTree.length > 1 || subTree[0]?.children) &&
        <aside className="hidden lg:block w-1/4 shrink-0">
          <a href="#page-content" className="skiplink">Skip secondary navigation</a>
          <SideNav menuItems={subTree} activeTrail={activeTrail}/>
        </aside>
      }

      <section className="flex-grow" id="page-content">
        {children}
      </section>
    </div>
  )
}

export default InteriorPage;
