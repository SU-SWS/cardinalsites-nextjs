import {getConfigPageField} from "@lib/gql/gql-queries"
import {StanfordBasicSiteSetting} from "@lib/gql/__generated__/graphql"
import Button from "@components/elements/button"
import Link from "@components/elements/link"

const UtilityNav = async () => {
  const headerButton = await getConfigPageField<
    StanfordBasicSiteSetting,
    StanfordBasicSiteSetting["suSiteHeaderButton"]
  >("StanfordBasicSiteSetting", "suSiteHeaderButton")

  const headerLinks = await getConfigPageField<StanfordBasicSiteSetting, StanfordBasicSiteSetting["suSiteHeaderLinks"]>(
    "StanfordBasicSiteSetting",
    "suSiteHeaderLinks"
  )
  if (!headerButton && !headerLinks) return

  return (
    <nav aria-label="Site utility navigation" className="mt-5 hidden lg:block">
      <ul className="list-unstyled flex items-center gap-10">
        {headerLinks?.map((link, i) => (
          <li key={`utility-link-${i}`} className="mb-0">
            <Link className="text-black no-underline hocus:underline" href={link.url || "#"}>
              {link.title}
            </Link>
          </li>
        ))}

        {headerButton?.url && (
          <li className="mb-0">
            <Button href={headerButton.url}>{headerButton.title}</Button>
          </li>
        )}
      </ul>
    </nav>
  )
}
export default UtilityNav
