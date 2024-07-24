import {getMenu} from "@lib/gql/gql-queries"
import MainMenuClient from "@components/menu/main-menu.client"
import {MenuAvailable} from "@lib/gql/__generated__/drupal.d"

const MainMenu = async () => {
  const menuItems = await getMenu(MenuAvailable.Main, 1)
  return <MainMenuClient menuItems={menuItems} />
}

export default MainMenu
