import Link from "@components/elements/link";
import LockupLogo from "@components/elements/lockup/lockup-logo";
import {FooterLockupProps} from "@components/config-pages/local-footer";

const LockupR = ({line5, siteName, logoUrl}: FooterLockupProps) => {
  return (
    <div className="py-10">
      <Link href="/" className="no-underline text-black">
        <div className="flex flex-col lg:flex-row gap-4">
          <div>
            <LockupLogo logoUrl={logoUrl} siteName={siteName}/>
            <div className="font-normal uppercase mt-4">{line5}</div>
          </div>
        </div>
      </Link>
    </div>
  )
}
export default LockupR;