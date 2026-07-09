import SiteSearchForm from "@components/search/site-search-form"
import MainMenu from "@components/menu/main-menu"
import GlobalMessage from "@components/config-pages/global-message"
import Lockup from "@components/elements/lockup/lockup"
import {HTMLAttributes} from "react"
import cn from "@lib/utils/className"
import UtilityNav from "@components/menu/utility-nav"
import {getConfigPageField} from "@lib/gql/gql-queries"
import {StanfordBasicSiteSetting} from "@lib/gql/__generated__/graphql"
import Link from "@components/elements/link"

type Props = HTMLAttributes<HTMLElement>

const PageHeader = async ({...props}: Props) => {
  const headerButton = await getConfigPageField<
    StanfordBasicSiteSetting,
    StanfordBasicSiteSetting["suSiteHeaderButton"]
  >("StanfordBasicSiteSetting", "suSiteHeaderButton")
  const hideSearch =
    (await getConfigPageField<StanfordBasicSiteSetting, StanfordBasicSiteSetting["suHideSiteSearch"]>(
      "StanfordBasicSiteSetting",
      "suHideSiteSearch"
    )) === true

  return (
    <header {...props} className={cn("shadow-lg", props.className)}>
      <div className="bg-cardinal-red">
        <div className="centered flex items-center justify-between py-3">
          <Link
            className="font-stanford text-20 font-regular leading-none text-white no-underline hocus:text-white hocus:underline"
            href="https://www.stanford.edu"
          >
            Stanford University
          </Link>

          {headerButton?.url && (
            <Link
              className="text-white no-underline hocus:text-white hocus:underline lg:hidden"
              href={headerButton.url}
            >
              {headerButton.title}
            </Link>
          )}
        </div>
      </div>
      <GlobalMessage />
      <div className="relative shadow">
        <div className="min-h-50 centered pr-24 lg:pr-0">
          <div className="flex w-full items-center justify-between">
            <Lockup />
            <div>
              <UtilityNav />
              {!hideSearch && <SiteSearchForm className="hidden lg:block" />}
            </div>
          </div>
        </div>

        <MainMenu hideSearch={hideSearch} />
      </div>
    </header>
  )
}
export default PageHeader
