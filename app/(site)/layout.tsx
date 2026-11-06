import UserAnalytics from "@components/elements/user-analytics/user-analytics"

/**
 * Public site routes. Analytics live here instead of the root layout so the editor preview routes,
 * which sit outside this group, never load them.
 */
const SiteLayout = ({children}: {children: React.ReactNode}) => (
  <>
    <UserAnalytics />
    {children}
  </>
)

export default SiteLayout
