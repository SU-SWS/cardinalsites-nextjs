import {getConfigPageField, getMenu} from "@lib/gql/gql-queries"
import {MenuAvailable, StanfordBasicSiteSetting} from "@lib/gql/__generated__/graphql"
import MainMenuClient from "@components/menu/main-menu.client"
import {Suspense} from "react"

type Props = {
  hideSearch?: boolean
}

const MainMenu = async ({hideSearch}: Props) => {
  const menuItems = await getMenu(MenuAvailable.Main, 3)
  const headerLinks = await getConfigPageField<StanfordBasicSiteSetting, StanfordBasicSiteSetting["suSiteHeaderLinks"]>(
    "StanfordBasicSiteSetting",
    "suSiteHeaderLinks"
  )
  if (!menuItems.length && !headerLinks?.length && hideSearch) return null

  return (
    <Suspense>
      <MainMenuClient hideSearch={hideSearch} menuItems={menuItems} headerLinks={headerLinks} />
    </Suspense>
  )
}

export default MainMenu
