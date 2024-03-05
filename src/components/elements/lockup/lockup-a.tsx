import Link from "@components/elements/link";
import LockupLogo from "@components/elements/lockup/lockup-logo";
import {FooterLockupProps} from "@components/config-pages/local-footer";

const LockupA = ({line1, line5, siteName, logoUrl}: FooterLockupProps) => {
  return (
    <div className="py-10">
      <Link href="/" className="no-underline text-black">
        <div className="flex flex-col items-start lg:flex-row gap-4">
          <LockupLogo logoUrl={logoUrl} siteName={siteName}/>

          <div className="w-[1px] bg-black shrink-0"/>
          <div className="font-normal text-black text-m2 leading-none">
            {line1 || siteName}
          </div>
        </div>

        {line5 &&
          <div className="font-semibold uppercase mt-4 border-t border-black lg:border-t-0">
            {line5}
          </div>
        }
      </Link>
    </div>
  )
}
export default LockupA;