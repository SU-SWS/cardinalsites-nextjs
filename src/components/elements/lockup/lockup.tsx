import Link from "@components/elements/link";
import LockupA from "@components/elements/lockup/lockup-a";
import LockupB from "@components/elements/lockup/lockup-b";
import LockupD from "@components/elements/lockup/lockup-d";
import LockupE from "@components/elements/lockup/lockup-e";
import LockupH from "@components/elements/lockup/lockup-h";
import LockupI from "@components/elements/lockup/lockup-i";
import LockupM from "@components/elements/lockup/lockup-m";
import LockupO from "@components/elements/lockup/lockup-o";
import LockupP from "@components/elements/lockup/lockup-p";
import LockupR from "@components/elements/lockup/lockup-r";
import LockupS from "@components/elements/lockup/lockup-s";
import LockupT from "@components/elements/lockup/lockup-t";
import LockupLogo from "@components/elements/lockup/lockup-logo";
import {LockupSetting, StanfordBasicSiteSetting} from "@lib/gql/__generated__/drupal.d";

type Props =
  Omit<LockupSetting, "__typename" | "id" | "metatag"> &
  Omit<StanfordBasicSiteSetting, "__typename" | "id" | "metatag">

export const Lockup = ({
  suLockupEnabled,
  suUseThemeLogo,
  suUploadLogoImage,
  suSiteName,
  suLine1,
  suLine2,
  suLine3,
  suLine4,
  suLine5,
  suLockupOptions
}: Props) => {
  const logoUrl = !suUseThemeLogo ? suUploadLogoImage?.url : undefined;
  const lockupProps = {
    line1: suLine1,
    line2: suLine2,
    line3: suLine3,
    line4: suLine4,
    line5: suLine5,
    siteName: suSiteName || "Stanford",
    logoUrl: logoUrl,
  }

  if (!suLockupEnabled) {
    return (
      <div className="py-10">
        <Link href="/" className="flex no-underline">
          <div className="self-end">
            <div className="lg:inline-block pr-2 mr-2 lg:border-r border-black">
              <LockupLogo {...lockupProps}/>
            </div>
            <div
              className="lg:inline-block font-normal text-black text-m2">
              {suSiteName || "University"}
            </div>
          </div>
        </Link>
      </div>
    )
  }

  switch (suLockupOptions) {
    case 'a':
      return <LockupA {...lockupProps}/>;

    case 'b':
      return <LockupB {...lockupProps}/>;

    case 'd':
      return <LockupD {...lockupProps}/>;

    case 'e':
      return <LockupE {...lockupProps}/>;

    case 'h':
      return <LockupH {...lockupProps}/>;

    case 'i':
      return <LockupI {...lockupProps}/>;

    case 'm':
      return <LockupM {...lockupProps}/>;

    case 'o':
      return <LockupO {...lockupProps}/>;

    case 'p':
      return <LockupP {...lockupProps}/>;

    case 'r':
      return <LockupR {...lockupProps}/>;

    case 's':
      return <LockupS {...lockupProps}/>;

    case 't':
      return <LockupT {...lockupProps}/>;

    case 'none':
    default:
      return (
        <div className="py-10">
          <Link href="/"
                className="flex flex-col lg:flex-row gap-4 no-underline">
            <LockupLogo {...lockupProps}/>
          </Link>
        </div>
      )
  }
}
export default Lockup;