import Link from "@components/elements/link"
import LockupLogo from "@components/elements/lockup/lockup-logo"
import {FooterLockupProps} from "@components/config-pages/local-footer"

const LockupB = ({line1, line2, siteName, logoUrl}: FooterLockupProps) => {
  return (
    <div className="py-20">
      <Link href="/" className="text-black no-underline">
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="mt-auto">
            <LockupLogo logoUrl={logoUrl} siteName={siteName} />
          </div>

          <div className="w-1 shrink-0 bg-black" />
          <div className="font-normal">
            <div className="type-0">{line1 || siteName}</div>
            <div className="type-2">{line2}</div>
          </div>
        </div>
      </Link>
    </div>
  )
}
export default LockupB
