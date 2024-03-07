import type {Meta, StoryObj} from '@storybook/react';
import {ComponentProps} from "react";
import GalleryParagraph from '@components/paragraphs/stanford-gallery/gallery-paragraph';
import { getStoryBookImage } from '../storybook-entities';

type ComponentStoryProps = ComponentProps<typeof GalleryParagraph> & {
  text: Text["processed"]
}

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<ComponentStoryProps> = {
  title: 'Design/Paragraphs/Gallery',
  component: GalleryParagraph,
  tags: ['autodocs'],
  argTypes: {}
};

export default meta;
type Story = StoryObj<ComponentStoryProps>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Gallery: Story = {
  render: ({...args}) => {
    return <GalleryParagraph {...args}/>
  },
  args: {
    paragraph:{
      __typename: 'ParagraphStanfordGallery',
      composition: {},
      langcode: {},
      created: {
        offset: "",
        timestamp: Math.round(new Date().getTime() / 1000),
        time: new Date().toISOString(),
        timezone: "America/Los_Angeles"
      },
      id: "1e0c21ee-7cb8-4eff-8877-862d16c9885c",
      suGalleryButton: {
        url: "http://stanford.edu",
        title: "Button text",
        internal: {},
      },
      suGalleryDescription: {
        processed: "<p>Pepper jack fromage frais pecorino cheesecake cheesy grin camembert de normandie macaroni cheese the big cheese.</p>"
      },
      suGalleryHeadline: "This is a Gallery Headline",
      suGalleryImages: [
        {
          id: "1645a861-ce72-41da-937d-e931a9671f5f",
          suGalleryCaption: "This is an image caption.",
          suGalleryImage: getStoryBookImage(),
        },
        {
          id: "6906300d-cd67-41cf-b5bb-165f839bdf1b",
          suGalleryCaption: "This is an image caption.",
          suGalleryImage: getStoryBookImage(),
        },
        {
          id:"c9bfa54a-7a54-4892-b3e5-72a1423fb221",
          suGalleryCaption: "This is an image caption.",
          suGalleryImage: getStoryBookImage(),
        }
      ]
    }
  }
};
