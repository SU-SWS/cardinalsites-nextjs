import type {Meta, StoryObj} from '@storybook/react';
import {ComponentProps} from "react";
import {ParagraphStanfordBanner, Text} from "@lib/gql/__generated__/drupal";
import BannerParagraph from '@components/paragraphs/stanford-banner/banner-paragraph';
import { getStoryBookImage } from '../storybook-entities';

type ComponentStoryProps = ComponentProps<typeof BannerParagraph> & {
  text: Text["processed"]
}

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<ComponentStoryProps> = {
  title: 'Design/Paragraphs/Banner',
  component: BannerParagraph,
  tags: ['autodocs'],
  argTypes: {}
};

export default meta;
type Story = StoryObj<ComponentStoryProps>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Banner: Story = {
  render: ({...args}) => {
    return <BannerParagraph {...args}/>
  },
  args: {
    paragraph:{
      __typename: 'ParagraphStanfordBanner',
      composition: {},
      langcode: {},
      created: {
        offset: "",
        timestamp: Math.round(new Date().getTime() / 1000),
        time: new Date().toISOString(),
        timezone: "America/Los_Angeles"
      },
      id: "9954cc81-919b-4498-9151-bf930831fca7",
      suBannerHeader: "Nam scelerisque, urna vitae auctor efficitur, tortor nunc cursus tortor, ut blandit purus arcu quis sapien",
      suBannerBody: {
        processed: "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras vitae dignissim felis. Nullam nulla leo, venenatis at feugiat sit amet, ultricies non lorem.</p>"
      },
      suBannerImage: getStoryBookImage(),
      suBannerSupHeader: "Vestibulum"
    }
  }
};
