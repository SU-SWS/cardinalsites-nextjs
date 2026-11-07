"use client"

import {SignalIcon} from "@heroicons/react/20/solid"
import Embed, {defaultProviders} from "react-tiny-oembed"
import {HtmlHTMLAttributes} from "react"
import {useIntersectionObserver} from "usehooks-ts"
import cn from "@lib/utils/className"

// Providers from https://oembed.com/providers.json. The library uses the last matching provider and endpoint, so
// broader schemes must come before more specific ones.
const customProviders = [
  {
    provider_name: "ArcGIS StoryMaps",
    provider_url: "https://storymaps.arcgis.com",
    endpoints: [{schemes: ["https://storymaps.arcgis.com/stories/*"], url: "https://storymaps.arcgis.com/oembed"}],
  },
  {
    provider_name: "CircuitLab",
    provider_url: "https://www.circuitlab.com/",
    endpoints: [{schemes: ["https://www.circuitlab.com/circuit/*"], url: "https://www.circuitlab.com/circuit/oembed/"}],
  },
  {
    provider_name: "Dailymotion",
    provider_url: "https://www.dailymotion.com",
    endpoints: [
      {
        schemes: ["https://www.dailymotion.com/video/*", "https://geo.dailymotion.com/player.html?video=*"],
        url: "https://www.dailymotion.com/services/oembed",
      },
    ],
  },
  {
    provider_name: "Facebook",
    provider_url: "https://www.facebook.com/",
    endpoints: [
      {schemes: ["https://www.facebook.com/*"], url: "https://graph.facebook.com/v16.0/oembed_page"},
      {
        schemes: [
          "https://www.facebook.com/*/posts/*",
          "https://www.facebook.com/*/activity/*",
          "https://www.facebook.com/*/photos/*",
          "https://www.facebook.com/photo.php?fbid=*",
          "https://www.facebook.com/photos/*",
          "https://www.facebook.com/permalink.php?story_fbid=*",
          "https://www.facebook.com/media/set?set=*",
          "https://www.facebook.com/questions/*",
          "https://www.facebook.com/notes/*/*/*",
        ],
        url: "https://graph.facebook.com/v16.0/oembed_post",
      },
      {
        schemes: [
          "https://www.facebook.com/*/videos/*",
          "https://www.facebook.com/video.php?id=*",
          "https://www.facebook.com/video.php?v=*",
        ],
        url: "https://graph.facebook.com/v16.0/oembed_video",
      },
    ],
  },
  {
    provider_name: "Flickr",
    provider_url: "https://www.flickr.com/",
    endpoints: [
      {
        schemes: [
          "http://*.flickr.com/photos/*",
          "http://flic.kr/p/*",
          "http://flic.kr/s/*",
          "https://*.flickr.com/photos/*",
          "https://flic.kr/p/*",
          "https://flic.kr/s/*",
          "https://*.*.flickr.com/*/*",
          "http://*.*.flickr.com/*/*",
        ],
        url: "https://www.flickr.com/services/oembed/",
      },
    ],
  },
  {
    provider_name: "Getty Images",
    provider_url: "https://www.gettyimages.com/",
    endpoints: [{schemes: ["http://gty.im/*", "https://gty.im/*"], url: "https://embed.gettyimages.com/oembed"}],
  },
  {
    provider_name: "Instagram",
    provider_url: "https://instagram.com",
    endpoints: [
      {
        schemes: [
          "http://instagram.com/*/p/*",
          "http://www.instagram.com/*/p/*",
          "https://instagram.com/*/p/*",
          "https://www.instagram.com/*/p/*",
          "http://instagram.com/p/*",
          "http://instagr.am/p/*",
          "http://www.instagram.com/p/*",
          "http://www.instagr.am/p/*",
          "https://instagram.com/p/*",
          "https://instagr.am/p/*",
          "https://www.instagram.com/p/*",
          "https://www.instagr.am/p/*",
          "http://instagram.com/tv/*",
          "http://instagr.am/tv/*",
          "http://www.instagram.com/tv/*",
          "http://www.instagr.am/tv/*",
          "https://instagram.com/tv/*",
          "https://instagr.am/tv/*",
          "https://www.instagram.com/tv/*",
          "https://www.instagr.am/tv/*",
          "http://www.instagram.com/reel/*",
          "https://www.instagram.com/reel/*",
          "http://instagram.com/reel/*",
          "https://instagram.com/reel/*",
          "http://instagr.am/reel/*",
          "https://instagr.am/reel/*",
        ],
        url: "https://graph.facebook.com/v16.0/instagram_oembed",
      },
    ],
  },
  {
    provider_name: "Issuu",
    provider_url: "https://issuu.com/",
    endpoints: [{schemes: ["https://issuu.com/*/docs/*"], url: "https://issuu.com/oembed"}],
  },
  {
    // No longer listed in the oembed.com registry.
    provider_name: "Livestream",
    provider_url: "https://livestream.com/",
    endpoints: [
      {
        schemes: [
          "https://livestream.com/accounts/*/events/*",
          "https://livestream.com/accounts/*/events/*/videos/*",
          "https://livestream.com/*/events/*",
          "https://livestream.com/*/events/*/videos/*",
          "https://livestream.com/*/*",
          "https://livestream.com/*/*/videos/*",
        ],
        url: "https://livestream.com/oembed",
      },
    ],
  },
  {
    provider_name: "MathEmbed",
    provider_url: "http://mathembed.com",
    endpoints: [{schemes: ["http://mathembed.com/latex?inputText=*"], url: "http://mathembed.com/oembed"}],
  },
  {
    provider_name: "Simplecast",
    provider_url: "https://simplecast.com",
    endpoints: [{schemes: ["https://simplecast.com/s/*"], url: "https://simplecast.com/oembed"}],
  },
  {
    provider_name: "SlideShare",
    provider_url: "https://www.slideshare.net/",
    endpoints: [
      {
        schemes: [
          "https://www.slideshare.net/*/*",
          "http://www.slideshare.net/*/*",
          "https://fr.slideshare.net/*/*",
          "http://fr.slideshare.net/*/*",
          "https://de.slideshare.net/*/*",
          "http://de.slideshare.net/*/*",
          "https://es.slideshare.net/*/*",
          "http://es.slideshare.net/*/*",
          "https://pt.slideshare.net/*/*",
          "http://pt.slideshare.net/*/*",
        ],
        url: "https://www.slideshare.net/api/oembed/2",
      },
    ],
  },
  {
    provider_name: "SoundCloud",
    provider_url: "https://soundcloud.com/",
    endpoints: [
      {
        schemes: [
          "http://soundcloud.com/*",
          "https://soundcloud.com/*",
          "https://on.soundcloud.com/*",
          "https://soundcloud.app.goog.gl/*",
        ],
        url: "https://soundcloud.com/oembed",
      },
    ],
  },
  {
    provider_name: "Spotify",
    provider_url: "https://spotify.com/",
    endpoints: [
      {
        schemes: ["https://open.spotify.com/*", "spotify:*", "https://spotify.link/*"],
        url: "https://open.spotify.com/oembed",
      },
    ],
  },
  {
    provider_name: "Stanford Digital Repository",
    provider_url: "https://purl.stanford.edu/",
    endpoints: [{schemes: ["https://purl.stanford.edu/*"], url: "https://purl.stanford.edu/embed.{format}"}],
  },
  {
    provider_name: "Twitter",
    provider_url: "https://www.twitter.com/",
    endpoints: [
      {
        schemes: [
          "https://twitter.com/*",
          "https://twitter.com/*/status/*",
          "https://*.twitter.com/*/status/*",
          "https://x.com/*/status/*",
        ],
        url: "https://publish.twitter.com/oembed",
      },
    ],
  },
]

const customProviderNames = customProviders.map(provider => provider.provider_name.toLowerCase())

const providers = [
  ...defaultProviders.filter(provider => !customProviderNames.includes(provider.provider_name.toLowerCase())),
  ...customProviders,
]

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  /**
   * Oembed URL.
   */
  url: string
}

const Oembed = ({url, ...props}: Props) => {
  const {isIntersecting, ref} = useIntersectionObserver({freezeOnceVisible: true})
  return (
    <div {...props} ref={ref} className={cn("oembed relative aspect-video w-full", props.className)}>
      {isIntersecting && <Embed url={url} providers={providers} LoadingFallbackElement={<Loading />} />}
    </div>
  )
}

const Loading = () => {
  return (
    <div className="flex h-full w-full items-baseline">
      <SignalIcon className="mx-auto animate-ping self-center" width={30} height={30} />
    </div>
  )
}

export default Oembed
