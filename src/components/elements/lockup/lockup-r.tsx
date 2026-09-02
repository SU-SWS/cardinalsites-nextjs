import Link from "@components/elements/link"
import LockupLogo from "@components/elements/lockup/lockup-logo"
import {FooterLockupProps} from "@components/config-pages/local-footer"

const LockupR = ({line5, siteName, logoUrl}: FooterLockupProps) => {
  return (
    <div className="py-20">
      <Link href="/" className="text-black no-underline">
        <div className="flex flex-col gap-8 lg:flex-row">
          <div>
            <LockupLogo logoUrl={logoUrl} siteName={siteName} />
            <div className="mt-8 font-normal uppercase">{line5}</div>
          </div>
        </div>
      </Link>
    </div>
  )
}
export default LockupR
