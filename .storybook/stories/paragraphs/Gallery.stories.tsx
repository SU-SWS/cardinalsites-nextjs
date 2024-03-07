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
        internal:true
      },
      suGalleryDescription: {
        processed: "<p>this is a description</p>"
      },
      suGalleryHeadline:"New Gallery",
      suGalleryImages: [
        {
          suGalleryCaption:"Very big spider",
          suGalleryImage: getStoryBookImage(),
        },
        {
          suGalleryCaption:"Poppies poppies my dear.",
          suGalleryImage: getStoryBookImage(),
        }
      ]
      
    }
  }
};
