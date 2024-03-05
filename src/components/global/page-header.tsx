import SiteSearchForm from "@components/search/site-search-form";
import MainMenu from "@components/menu/main-menu";
import GlobalMessage from "@components/config-pages/global-message";
import Lockup from "@components/elements/lockup/lockup";
import {getConfigPage, getMenu} from "@lib/gql/gql-queries";
import {
  LockupSetting,
  MenuAvailable,
  StanfordBasicSiteSetting,
  StanfordGlobalMessage
} from "@lib/gql/__generated__/drupal.d";
import {isDraftMode} from "@lib/drupal/utils";

const PageHeader = async () => {
  const menuItems = await getMenu(MenuAvailable.Main, isDraftMode());
  const globalMessageConfig = await getConfigPage<StanfordGlobalMessage>('StanfordGlobalMessage');
  const siteSettingsConfig = await getConfigPage<StanfordBasicSiteSetting>('StanfordBasicSiteSetting')
  const lockupSettingsConfig = await getConfigPage<LockupSetting>('LockupSetting')

  return (
    <header className="shadow-lg">
      <div className="bg-cardinal-red">
        <div className="centered py-3">
          <a
            className="font-stanford no-underline font-regular text-20 hocus:underline text-white hocus:text-white leading-none"
            href="https://www.stanford.edu"
          >
            Stanford University
          </a>
        </div>
      </div>
      {globalMessageConfig && <GlobalMessage {...globalMessageConfig}/>}
      <div className="relative shadow">
        <div className="centered min-h-50 pr-24 lg:pr-0">
          <div className="flex w-full justify-between">
            <Lockup {...siteSettingsConfig} {...lockupSettingsConfig}/>
            <SiteSearchForm className="hidden lg:block"/>
          </div>
        </div>

        <MainMenu menuItems={menuItems}/>
      </div>
    </header>
  )
}
export default PageHeader;