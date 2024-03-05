import Address from "@components/elements/address";
import Link from "@components/elements/link";
import Wysiwyg from "@components/elements/wysiwyg";
import LockupLogo from "@components/elements/lockup/lockup-logo";
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
import {JSX} from "react";
import {H2} from "@components/elements/headers";
import TwitterIcon from "@components/elements/icons/TwitterIcon";
import YoutubeIcon from "@components/elements/icons/YoutubeIcon";
import FacebookIcon from "@components/elements/icons/FacebookIcon";
import { Maybe, StanfordLocalFooter} from "@lib/gql/__generated__/drupal.d";
import {buildUrl} from "@lib/drupal/utils";

const LocalFooter = ({
  suFooterEnabled,
  suLocalFootAction,
  suLocalFootAddress,
  suLocalFootLine1,
  suLocalFootLine2,
  suLocalFootLine3,
  suLocalFootLine4,
  suLocalFootLine5,
  suLocalFootLocImg,
  suLocalFootLocOp,
  suLocalFootPrCo,
  suLocalFootPrimary,
  suLocalFootPrimeH,
  suLocalFootSeCo,
  suLocalFootSecond,
  suLocalFootSecondH,
  suLocalFootSocial,
  suLocalFootTr2Co,
  suLocalFootTrCo,
  suLocalFootUseLoc,
  suLocalFootUseLogo,
}: StanfordLocalFooter) => {
  if (!suFooterEnabled) return;

  const lockupProps = {
    useDefault: suLocalFootUseLoc,
    lockupOption: suLocalFootLocOp,
    line1: suLocalFootLine1,
    line2: suLocalFootLine2,
    line3: suLocalFootLine3,
    line4: suLocalFootLine4,
    line5: suLocalFootLine5,
    logoUrl: !suLocalFootUseLogo && suLocalFootLocImg?.url ? buildUrl(suLocalFootLocImg?.url).toString() : undefined,
  }

  return (
    <div className="local-footer bg-foggy-light py-20">
      <div className="centered">
        <div className="mb-20">
          <FooterLockup {...lockupProps} />
        </div>

        <div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-32 [&_a]:font-normal [&_a]:no-underline [&_a:hover]:underline [&_a:hover]:text-black [&_a:focus]:underline [&_a:focus]:text-black [&_a]:transition">
          <div>

            {suLocalFootAddress &&
              <Address {...suLocalFootAddress}/>
            }

            {suLocalFootAction &&
              <ul className="list-unstyled">
                {suLocalFootAction.map((link, index) => {
                  if (!link.url) return;
                  return (
                    <li key={`footer-action-link-${index}`}>
                      <Link href={link.url}>
                        {link.title}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            }

            {suLocalFootSocial &&
              <ul className="list-unstyled flex gap-2">
                {suLocalFootSocial.map((link, index) => {
                  if (!link.url) return;
                  return (
                    <li key={`footer-action-link-${index}`}>
                      <Link href={link.url}>
                        <SocialIcon url={link.url}/>
                        <span className="sr-only">{link.title}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            }

            <Wysiwyg html={suLocalFootPrCo?.processed}/>
          </div>

          <div>
            {suLocalFootPrimeH &&
              <H2 className="text-m1">{suLocalFootPrimeH}</H2>}
            {suLocalFootPrimary &&
              <ul className="list-unstyled">
                {suLocalFootPrimary.map((link, index) => {
                  if (!link.url) return;
                  return (
                    <li key={`footer-primary-link-${index}`}>
                      <Link href={link.url}>
                        {link.title}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            }
            <Wysiwyg html={suLocalFootSeCo?.processed}/>

          </div>

          <div>
            {suLocalFootSecondH &&
              <H2 className="text-m1">{suLocalFootSecondH}</H2>}

            {suLocalFootSecond &&
              <ul className="list-unstyled">
                {suLocalFootSecond.map((link, index) => {
                  if (!link.url) return;
                  return (
                    <li key={`footer-second-link-${index}`}>
                      <Link href={link.url}>
                        {link.title}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            }

            <Wysiwyg html={suLocalFootTr2Co?.processed}/>

          </div>

          <Wysiwyg html={suLocalFootTrCo?.processed}/>

        </div>
      </div>
    </div>
  )
}

const SocialIcon = ({url}: { url: string }) => {
  if (url.includes('twitter.com')) return <TwitterIcon/>
  if (url.includes('youtube.com')) return <YoutubeIcon/>
  if (url.includes('facebook')) return <FacebookIcon/>
  return null;
}

export interface FooterLockupProps {
  useDefault?: Maybe<boolean>
  siteName?: Maybe<string>
  lockupOption?: Maybe<string>
  line1?: Maybe<string>
  line2?: Maybe<string>
  line3?: Maybe<string>
  line4?: Maybe<string>
  line5?: Maybe<string>
  logoUrl?: Maybe<string>
}

const FooterLockup = ({useDefault = true, siteName, lockupOption, ...props}: FooterLockupProps): JSX.Element => {
  const lockupProps = {
    ...props
  }

  lockupOption = useDefault ? 'default' : lockupOption

  switch (lockupOption) {
    case 'none':
      return (
        <div className="py-10">
          <Link href="/"
                className="flex flex-col lg:flex-row gap-4 no-underline">
            <LockupLogo {...lockupProps}/>
          </Link>
        </div>
      )

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
  }


  return (
    <div className="py-10">
      <Link href="/" className="flex flex-col lg:flex-row gap-4 no-underline">
        <LockupLogo {...lockupProps}/>

        <div className="w-[1px] bg-black shrink-0"/>
        <div className="font-normal text-black text-m2 leading-none">
          {siteName || "University"}
        </div>
      </Link>
    </div>
  )

}
export default LocalFooter;