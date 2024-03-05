import Link from "@components/elements/link";
import LockupLogo from "@components/elements/lockup/lockup-logo";
import {FooterLockupProps} from "@components/config-pages/local-footer";

const LockupD = ({line1, line3, siteName, logoUrl}: FooterLockupProps) => {
  return (
    <div className="py-10">
      <Link href="/" className="no-underline text-black">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="mt-auto">
            <LockupLogo logoUrl={logoUrl} siteName={siteName}/>
          </div>

          <div className="w-[1px] bg-black shrink-0"/>
          <div className="font-normal">
            <div className="text-m1">{line1 || siteName}</div>
            <div className="text-m0 italic">{line3}</div>
          </div>
        </div>
      </Link>
    </div>
  )
}
export default LockupD;