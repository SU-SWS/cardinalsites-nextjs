import Link from "@components/elements/link"
import LockupA from "@components/elements/lockup/lockup-a"
import LockupB from "@components/elements/lockup/lockup-b"
import LockupD from "@components/elements/lockup/lockup-d"
import LockupE from "@components/elements/lockup/lockup-e"
import LockupH from "@components/elements/lockup/lockup-h"
import LockupI from "@components/elements/lockup/lockup-i"
import LockupM from "@components/elements/lockup/lockup-m"
import LockupO from "@components/elements/lockup/lockup-o"
import LockupP from "@components/elements/lockup/lockup-p"
import LockupR from "@components/elements/lockup/lockup-r"
import LockupS from "@components/elements/lockup/lockup-s"
import LockupT from "@components/elements/lockup/lockup-t"
import LockupLogo from "@components/elements/lockup/lockup-logo"
import {LockupSetting, StanfordBasicSiteSetting} from "@lib/gql/__generated__/drupal.d"
import {getConfigPage, getConfigPageField} from "@lib/gql/gql-queries"

export const Lockup = async () => {
  const siteName = await getConfigPageField<StanfordBasicSiteSetting, StanfordBasicSiteSetting["suSiteName"]>(
    "StanfordBasicSiteSetting",
    "suSiteName"
  )

  const lockupSettingsConfig = await getConfigPage<LockupSetting>("LockupSetting")

  const logoUrl = !lockupSettingsConfig?.suUseThemeLogo ? lockupSettingsConfig?.suUploadLogoImage?.url : undefined
  const lockupProps = {
    line1: lockupSettingsConfig?.suLine1,
    line2: lockupSettingsConfig?.suLine2,
    line3: lockupSettingsConfig?.suLine3,
    line4: lockupSettingsConfig?.suLine4,
    line5: lockupSettingsConfig?.suLine5,
    siteName: siteName || "Stanford",
    logoUrl: logoUrl,
  }

  if (!lockupSettingsConfig?.suLockupEnabled) {
    return (
      <div className="py-10">
        <Link href="/" className="flex no-underline">
          <div className="self-end">
            <div className="mr-2 border-black pr-2 lg:inline-block lg:border-r">
              <LockupLogo {...lockupProps} />
            </div>
            <div className="type-3 font-normal text-black lg:inline-block">{siteName || "University"}</div>
          </div>
        </Link>
      </div>
    )
  }

  switch (lockupSettingsConfig?.suLockupOptions) {
    case "a":
      return <LockupA {...lockupProps} />

    case "b":
      return <LockupB {...lockupProps} />

    case "d":
      return <LockupD {...lockupProps} />

    case "e":
      return <LockupE {...lockupProps} />

    case "h":
      return <LockupH {...lockupProps} />

    case "i":
      return <LockupI {...lockupProps} />

    case "m":
      return <LockupM {...lockupProps} />

    case "o":
      return <LockupO {...lockupProps} />

    case "p":
      return <LockupP {...lockupProps} />

    case "r":
      return <LockupR {...lockupProps} />

    case "s":
      return <LockupS {...lockupProps} />

    case "t":
      return <LockupT {...lockupProps} />

    case "none":
    default:
      return (
        <div className="py-10">
          <Link href="/" className="flex flex-col gap-4 no-underline lg:flex-row">
            <LockupLogo {...lockupProps} />
          </Link>
        </div>
      )
  }
}
export default Lockup
