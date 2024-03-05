import Link from "@components/elements/link";
import LockupLogo from "@components/elements/lockup/lockup-logo";
import {FooterLockupProps} from "@components/config-pages/local-footer";

const LockupI = ({line1, line3, line4, siteName, logoUrl}: FooterLockupProps) => {
  return (
    <div className="py-10">
      <Link href="/" className="no-underline text-black">
        <div className="flex flex-col lg:flex-row gap-4">
          <div>
            <LockupLogo logoUrl={logoUrl} siteName={siteName}/>
            <div className="font-semibold text-m1 uppercase">{line4}</div>
          </div>

          <div className="w-[1px] bg-black shrink-0"/>
          <div className="font-normal mt-auto">
            <div className="text-m1">{line1 || siteName}</div>
            <div className="text-m0 italic">{line3}</div>
          </div>
        </div>
      </Link>
    </div>
  )
}
export default LockupI;