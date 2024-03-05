import {MediaImage, MediaVideo, TermInterface} from "../../src/lib/gql/__generated__/drupal";

export const getStoryBookImage = (imageUrl?: string): MediaImage => {
  return {
    __typename: 'MediaImage',
    name: makeid(),
    path: "",
    status: true,
    id: makeid(),
    changed: {
      offset: "",
      timestamp: Math.round(new Date().getTime() / 1000),
      time: new Date().toISOString(),
      timezone: "America/Los_Angeles"
    },
    created: {
      offset: "",
      timestamp: Math.round(new Date().getTime() / 1000),
      time: new Date().toISOString(),
      timezone: "America/Los_Angeles"
    },
    langcode: {},
    metatag: [],
    mediaImage: {
      url: imageUrl || "https://placekitten.com/1500/1500",
      height: 1500,
      width: 1500,
      alt: "kittens",
      size: 123,
    }
  }
}

export const getStoryBookVideo = (videoUrl?: string): MediaVideo => {
  return {
    __typename: 'MediaVideo',
    name: makeid(),
    path: "",
    status: true,
    id: makeid(),
    changed: {
      offset: "",
      timestamp: Math.round(new Date().getTime() / 1000),
      time: new Date().toISOString(),
      timezone: "America/Los_Angeles"
    },
    created: {
      offset: "",
      timestamp: Math.round(new Date().getTime() / 1000),
      time: new Date().toISOString(),
      timezone: "America/Los_Angeles"
    },
    langcode: {},
    metatag: [],
    mediaOembedVideo: videoUrl || "https://www.youtube.com/watch?v=9P8mASSREYM"
  }
}

export const getStoryBookTaxonomyTerm = (name?: string): TermInterface => {
  return {
    name: name || 'Foo Bar',
    id: makeid(),
    description: {},
    langcode: {},
    changed: {offset: "", time: "", timezone: "", timestamp: ""},
    metatag: [],
    path: "",
    status: true,
    weight: 0,
  }
}

const makeid = (length: number = 10) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}