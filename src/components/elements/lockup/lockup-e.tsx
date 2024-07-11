import Link from "@components/elements/link"
import LockupLogo from "@components/elements/lockup/lockup-logo"
import {FooterLockupProps} from "@components/config-pages/local-footer"

const LockupE = ({line1, line2, line3, siteName, logoUrl}: FooterLockupProps) => {
  return (
    <div className="py-10">
      <Link href="/" className="text-black no-underline">
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="mt-auto">
            <LockupLogo logoUrl={logoUrl} siteName={siteName} />
          </div>

          <div className="w-[1px] shrink-0 bg-black" />
          <div className="font-normal">
            <div className="text-m1">{line1 || siteName}</div>
            <div className="text-m1">{line2 || siteName}</div>
            <div className="text-m0 italic">{line3}</div>
          </div>
        </div>
      </Link>
    </div>
  )
}
export default LockupE
