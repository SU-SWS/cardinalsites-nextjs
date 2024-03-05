import {decode} from 'html-entities';
import {Metadata} from "next";
import {
  Maybe,
  NodeStanfordEvent,
  NodeStanfordNews,
  NodeStanfordPage,
  NodeStanfordPerson, NodeStanfordPolicy,
  NodeUnion, ParagraphStanfordWysiwyg, ParagraphUnion
} from "@lib/gql/__generated__/drupal.d";

export const getNodeMetadata = (node: NodeUnion): Metadata => {
  const defaultData = {
    title: node.title,
    other: {}
  }
  switch (node.__typename) {
    case 'NodeStanfordPage':
      return {
        ...getBasicPageMetaData(node),
        ...defaultData
      }

    case 'NodeStanfordNews':
      return {
        ...getNewsMetaData(node),
        ...defaultData
      }

    case 'NodeStanfordEvent':
      return {
        ...getEventMetaData(node),
        ...defaultData
      }

    case 'NodeStanfordPerson':
      return {
        ...getPersonMetaData(node),
        ...defaultData
      }

    case 'NodeStanfordPolicy':
      return {
        ...getPolicyMetaData(node),
        ...defaultData
      }
  }

  return defaultData;
}

const getBasicPageMetaData = (node: NodeStanfordPage) => {
  const pageTitleBannerImage = node.suPageBanner?.__typename === "ParagraphStanfordPageTitleBanner" && node.suPageBanner.suTitleBannerImage.mediaImage;
  const bannerImage = node.suPageBanner?.__typename === "ParagraphStanfordBanner" && node.suPageBanner.suBannerImage?.mediaImage;
  const image = node.suPageImage?.mediaImage || pageTitleBannerImage || bannerImage;

  const description = node.suPageDescription || getFirstText(node.suPageComponents);

  return {
    description: description,
    openGraph: {
      type: 'website',
      title: node.title,
      description: description,
      images: image ? getOpenGraphImage(image.url, image.alt || "") : []
    }
  }
}

const getNewsMetaData = (node: NodeStanfordNews) => {
  const pageImage = node.suNewsFeaturedMedia?.mediaImage;
  const bannerImage = node.suNewsBanner?.__typename === 'MediaImage' ? node.suNewsBanner.mediaImage : undefined;

  const imageUrl = pageImage?.url || bannerImage?.url
  const imageAlt = pageImage?.alt || bannerImage?.alt || '';

  const description = node.suNewsDek || getFirstText(node.suNewsComponents);

  let publishTime;
  if (node.suNewsPublishingDate) {
    publishTime = new Date(node.suNewsPublishingDate.time).toISOString()
  }

  return {
    description: description,
    openGraph: {
      type: 'article',
      title: node.title,
      description: description,
      publishedTime: publishTime || null,
      tag: node.suNewsTopics?.map(term => term.name) || [],
      images: getOpenGraphImage(imageUrl, imageAlt)
    }
  }
}

const getPersonMetaData = (node: NodeStanfordPerson) => {
  const pageImage = node.suPersonPhoto?.mediaImage;
  const imageUrl = pageImage?.url;
  const imageAlt = pageImage?.alt || '';
  const description = node.suPersonFullTitle || getCleanDescription(node.body?.processed);

  return {
    description: description,
    openGraph: {
      type: 'profile',
      title: node.title,
      description: description,
      firstName: node.suPersonFirstName,
      lastName: node.suPersonLastName,
      images: getOpenGraphImage(imageUrl, imageAlt)
    }
  }
}

const getEventMetaData = (node: NodeStanfordEvent) => {
  const description = node.suEventSubheadline || getCleanDescription(node.body?.processed);

  return {
    description: description,
    openGraph: {
      type: 'website',
      title: node.title,
      description: description,
    }
  }
}

const getPolicyMetaData = (node: NodeStanfordPolicy) => {
  const description = getCleanDescription(node.body?.processed);

  return {
    description: description,
    openGraph: {
      type: 'website',
      title: node.title,
      description: description,
    }
  }
}

const getFirstText = (components?: Maybe<ParagraphUnion[]>) => {
  const firstWysiwyg = components?.find(component => component.__typename === 'ParagraphStanfordWysiwyg') as ParagraphStanfordWysiwyg;
  if (firstWysiwyg) {
    return getCleanDescription(firstWysiwyg.suWysiwygText?.processed);
  }
}

const getCleanDescription = (description: string | undefined): string | undefined => {
  if (description) {
    const text: string = description.replace(/(<([^>]+)>)/gi, " ").replace('/ +/', ' ').split('.').slice(0, 1).join('.') + '.';
    return text?.length > 1 ? decode(text) : undefined;
  }
}


const getOpenGraphImage = (imageUrl?: string, imageAlt?: string) => {
  if (imageUrl) {
    return [
      {
        url: imageUrl,
        width: 956,
        height: 478,
        alt: imageAlt,
      }
    ]
  }
  return [];
}