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
      
      id: "a3a6bb56-8ad2-467e-af49-d070848ee4b9",
      suGalleryButton: {
        url:"/about",
        title:"Link text",
      },
      suGalleryDescription: {
        processed: "<p>Please enter the description here. </p>"
      },
      suGalleryHeadline:"New Gallery",
      suGalleryImages: [
        {
          id: "c9bfa54a-7a54-4892-b3e5-72a1423fb221",
          suGalleryCaption:"This is a caption",
          suGalleryImage: getStoryBookImage(),
        },
        {
          id: "6906300d-cd67-41cf-b5bb-165f839bdf1b",
          suGalleryCaption:"This is a caption",
          suGalleryImage: getStoryBookImage(),
        }
      ]
    }
  }
};
