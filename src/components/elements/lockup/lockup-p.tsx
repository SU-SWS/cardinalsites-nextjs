import Link from "@components/elements/link"
import LockupLogo from "@components/elements/lockup/lockup-logo"
import {FooterLockupProps} from "@components/config-pages/local-footer"

const LockupP = ({line1, line4, siteName, logoUrl}: FooterLockupProps) => {
  return (
    <div className="py-20">
      <Link href="/" className="text-black no-underline">
        <div className="flex flex-col gap-8 lg:flex-row">
          <div>
            <LockupLogo logoUrl={logoUrl} siteName={siteName} />
            <div className="mt-2 type-2 font-semibold uppercase">{line4}</div>
          </div>

          <div className="w-1 shrink-0 bg-black" />
          <div className="mt-auto type-2 font-normal">{line1 || siteName}</div>
        </div>
      </Link>
    </div>
  )
}
export default LockupP
