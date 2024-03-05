import Link from "@components/elements/link";
import LockupLogo from "@components/elements/lockup/lockup-logo";
import {FooterLockupProps} from "@components/config-pages/local-footer";

const LockupM = ({line1, line2, siteName, logoUrl}: FooterLockupProps) => {
  return (
    <div className="py-10">
      <Link href="/" className="no-underline text-black">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="mt-auto">
            <LockupLogo logoUrl={logoUrl} siteName={siteName}/>
          </div>

          <div className="w-[1px] bg-black shrink-0"/>
          <div className="font-normal text-m1">
            <div>{line1 || siteName}</div>
            <div>{line2}</div>
          </div>
        </div>
      </Link>
    </div>
  )
}
export default LockupM;