import Link from "@components/elements/link";
import LockupLogo from "@components/elements/lockup/lockup-logo";
import {FooterLockupProps} from "@components/config-pages/local-footer";

const LockupO = ({line4, siteName, logoUrl}: FooterLockupProps) => {
  return (
    <div className="py-10">
      <Link href="/" className="no-underline text-black">
        <LockupLogo logoUrl={logoUrl} siteName={siteName}/>
        <div className="font-semibold text-m1 uppercase">{line4}</div>
      </Link>
    </div>
  )
}
export default LockupO;