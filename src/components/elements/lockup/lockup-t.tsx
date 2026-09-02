import Link from "@components/elements/link"
import LockupLogo from "@components/elements/lockup/lockup-logo"
import {FooterLockupProps} from "@components/config-pages/local-footer"

const LockupT = ({line1, line2, line3, line4, siteName, logoUrl}: FooterLockupProps) => {
  return (
    <div className="py-20">
      <Link href="/" className="text-black no-underline">
        <LockupLogo logoUrl={logoUrl} siteName={siteName} />
        <div className="mt-2 border-b border-black type-2 font-semibold uppercase">{line4}</div>
        <div className="font-normal">
          <div className="type-2">{line1 || siteName}</div>
          <div className="type-2">{line2}</div>
          <div className="type-0 italic">{line3}</div>
        </div>
      </Link>
    </div>
  )
}
export default LockupT
