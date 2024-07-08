import SiteSearchForm from "@components/search/site-search-form"
import MainMenu from "@components/menu/main-menu"
import GlobalMessage from "@components/config-pages/global-message"
import Lockup from "@components/elements/lockup/lockup"
import {getConfigPage, getMenu} from "@lib/gql/gql-queries"
import {LockupSetting, MenuAvailable, StanfordBasicSiteSetting} from "@lib/gql/__generated__/drupal.d"
import {HTMLAttributes} from "react"
import {twMerge} from "tailwind-merge"

type Props = HTMLAttributes<HTMLElement>

const PageHeader = async ({...props}: Props) => {
  const menuItems = await getMenu(MenuAvailable.Main)

  const siteSettingsConfig = await getConfigPage<StanfordBasicSiteSetting>("StanfordBasicSiteSetting")
  const lockupSettingsConfig = await getConfigPage<LockupSetting>("LockupSetting")

  return (
    <header
      {...props}
      className={twMerge("shadow-lg", props.className)}
    >
      <div className="bg-cardinal-red">
        <div className="centered py-3">
          <a
            className="font-stanford text-20 font-regular leading-none text-white no-underline hocus:text-white hocus:underline"
            href="https://www.stanford.edu"
          >
            Stanford University
          </a>
        </div>
      </div>
      <GlobalMessage />
      <div className="relative shadow">
        <div className="min-h-50 centered pr-24 lg:pr-0">
          <div className="flex w-full justify-between">
            <Lockup
              {...siteSettingsConfig}
              {...lockupSettingsConfig}
            />
            <SiteSearchForm className="hidden lg:block" />
          </div>
        </div>

        <MainMenu menuItems={menuItems} />
      </div>
    </header>
  )
}
export default PageHeader
