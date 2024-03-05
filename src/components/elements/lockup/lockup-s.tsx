import Link from "@components/elements/link";
import LockupLogo from "@components/elements/lockup/lockup-logo";
import {FooterLockupProps} from "@components/config-pages/local-footer";

const LockupS = ({line1, line2, line4, siteName, logoUrl}: FooterLockupProps) => {
  return (
    <div className="py-10">
      <Link href="/" className="no-underline text-black">

        <LockupLogo logoUrl={logoUrl} siteName={siteName}/>
        <div className="text-m1 font-semibold uppercase border-b border-black">{line4}</div>
        <div className="font-normal">
          <div className="text-m1">{line1 || siteName}</div>
          <div className="text-m1">{line2}</div>
        </div>

      </Link>
    </div>
  )
}
export default LockupS;