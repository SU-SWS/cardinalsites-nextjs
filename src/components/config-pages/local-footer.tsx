import Address from "@components/elements/address"
import Link from "@components/elements/link"
import Wysiwyg from "@components/elements/wysiwyg"
import LockupLogo from "@components/elements/lockup/lockup-logo"
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
import {HTMLAttributes, JSX} from "react"
import {H2} from "@components/elements/headers"
import TwitterIcon from "@components/elements/icons/TwitterIcon"
import YoutubeIcon from "@components/elements/icons/YoutubeIcon"
import FacebookIcon from "@components/elements/icons/FacebookIcon"
import {Maybe, StanfordLocalFooter} from "@lib/gql/__generated__/graphql"
import {buildUrl} from "@lib/utils/utils"
import {getConfigPage} from "@lib/gql/gql-queries"
import twMerge from "@lib/utils/twMerge"
import LinkedInIcon from "@components/elements/icons/LinkedInIcon"
import InstagramIcon from "@components/elements/icons/InstagramIcon"
import BlueSkyIcon from "@components/elements/icons/BlueSkyIcon"
import FlickrIcon from "@components/elements/icons/FlickrIcon"
import GithubIcon from "@components/elements/icons/GithubIcon"
import GoogleScholarIcon from "@components/elements/icons/GoogleScholarIcon"
import MastodonIcon from "@components/elements/icons/MastodonIcon"
import ThreadsIcon from "@components/elements/icons/ThreadsIcon"
import ActionLink from "@components/elements/action-link"

type Props = HTMLAttributes<HTMLDivElement>

const LocalFooter = async ({...props}: Props) => {
  const localFooterConfig = await getConfigPage<StanfordLocalFooter>("StanfordLocalFooter")
  if (!localFooterConfig?.suFooterEnabled) return

  const lockupProps = {
    useDefault: localFooterConfig.suLocalFootUseLoc,
    lockupOption: localFooterConfig.suLocalFootLocOp,
    line1: localFooterConfig.suLocalFootLine1,
    line2: localFooterConfig.suLocalFootLine2,
    line3: localFooterConfig.suLocalFootLine3,
    line4: localFooterConfig.suLocalFootLine4,
    line5: localFooterConfig.suLocalFootLine5,
    logoUrl:
      !localFooterConfig.suLocalFootUseLogo && localFooterConfig.suLocalFootLocImg?.url
        ? buildUrl(localFooterConfig.suLocalFootLocImg?.url).toString()
        : undefined,
  }

  return (
    <div {...props} className={twMerge("local-footer bg-foggy-light py-20", props.className)}>
      <div className="centered">
        <div className="mb-20">
          <FooterLockup {...lockupProps} />
        </div>

        <div className="grid gap-32 md:grid-cols-2 lg:grid-cols-4 [&_a:focus]:text-black [&_a:focus]:underline [&_a:hover]:text-black [&_a:hover]:underline [&_a]:font-normal [&_a]:no-underline [&_a]:transition">
          <div className="space-y-12">
            {localFooterConfig.suLocalFootAddress && <Address {...localFooterConfig.suLocalFootAddress} />}

            {localFooterConfig.suLocalFootAction && (
              <ul className="list-unstyled">
                {localFooterConfig.suLocalFootAction.map((link, index) => {
                  if (!link.url) return
                  return (
                    <li key={`footer-action-link-${index}`} className="m-0 p-0">
                      <ActionLink href={link.url} className="text-2xl">
                        {link.title}
                      </ActionLink>
                    </li>
                  )
                })}
              </ul>
            )}

            {localFooterConfig.suLocalFootSocial && (
              <ul className="list-unstyled flex flex-wrap gap-3">
                {localFooterConfig.suLocalFootSocial.map((link, index) => {
                  if (!link.url) return
                  return (
                    <li key={`footer-action-link-${index}`}>
                      <Link
                        href={link.url}
                        className="block rounded-full border border-transparent p-2 hocus:border-digital-blue [&_svg]:fill-black hocus:[&_svg]:fill-digital-blue"
                      >
                        <SocialIcon url={link.url} />
                        <span className="sr-only">{link.title}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            )}

            <Wysiwyg html={localFooterConfig.suLocalFootPrCo?.processed} />
          </div>

          <div>
            {localFooterConfig.suLocalFootPrimeH && <H2 className="type-0">{localFooterConfig.suLocalFootPrimeH}</H2>}
            {localFooterConfig.suLocalFootPrimary && (
              <ul className="list-unstyled">
                {localFooterConfig.suLocalFootPrimary.map((link, index) => {
                  if (!link.url) return
                  return (
                    <li key={`footer-primary-link-${index}`} className="m-0 p-0">
                      <Link href={link.url} className="text-3xl">
                        {link.title}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            )}
            <Wysiwyg html={localFooterConfig.suLocalFootSeCo?.processed} />
          </div>

          <div>
            {localFooterConfig.suLocalFootSecondH && <H2 className="type-0">{localFooterConfig.suLocalFootSecondH}</H2>}

            {localFooterConfig.suLocalFootSecond && (
              <ul className="list-unstyled">
                {localFooterConfig.suLocalFootSecond.map((link, index) => {
                  if (!link.url) return
                  return (
                    <li key={`footer-second-link-${index}`} className="m-0 p-0">
                      <Link href={link.url} className="text-3xl">
                        {link.title}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            )}

            <Wysiwyg html={localFooterConfig.suLocalFootTr2Co?.processed} />
          </div>

          <Wysiwyg html={localFooterConfig.suLocalFootTrCo?.processed} />
        </div>
      </div>
    </div>
  )
}

const SocialIcon = ({url}: {url: string}) => {
  if (url.includes("twitter.com") || url.includes("x.com")) return <TwitterIcon />
  if (url.includes("youtube.com")) return <YoutubeIcon />
  if (url.includes("facebook")) return <FacebookIcon />
  if (url.includes("linkedin")) return <LinkedInIcon />
  if (url.includes("instagram")) return <InstagramIcon />
  if (url.includes("bsky")) return <BlueSkyIcon />
  if (url.includes("google")) return <GoogleScholarIcon />
  if (url.includes("github")) return <GithubIcon />
  if (url.includes("flickr")) return <FlickrIcon />
  if (url.includes("mastodon")) return <MastodonIcon />
  if (url.includes("threads")) return <ThreadsIcon />
  if (url.includes("youtube")) return <YoutubeIcon />

  console.warn("Social link icon not supported: " + url)
  return null
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
    ...props,
  }

  lockupOption = useDefault ? "default" : lockupOption

  switch (lockupOption) {
    case "none":
      return (
        <div className="py-10">
          <Link href="/" className="flex flex-col gap-4 no-underline lg:flex-row" aria-label="Home">
            <LockupLogo {...lockupProps} />
          </Link>
        </div>
      )

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
  }

  return (
    <div className="py-10">
      <Link href="/" className="flex flex-col gap-4 no-underline lg:flex-row">
        <LockupLogo {...lockupProps} />

        <div className="w-[1px] shrink-0 bg-black" />
        <div className="type-3 font-normal leading-none text-black">{siteName || "University"}</div>
      </Link>
    </div>
  )
}
export default LocalFooter
