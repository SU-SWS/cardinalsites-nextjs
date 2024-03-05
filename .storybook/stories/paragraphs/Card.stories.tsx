import type {Meta, StoryObj} from '@storybook/react';
import {ComponentProps} from "react";
import {ParagraphStanfordCard, Text} from "@lib/gql/__generated__/drupal";
import CardParagraph from '@components/paragraphs/stanford-card/card-paragraph';
import { getStoryBookImage } from '../storybook-entities';

type ComponentStoryProps = ComponentProps<typeof CardParagraph> & {
  text: Text["processed"]
}

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<ComponentStoryProps> = {
  title: 'Design/Paragraphs/Card',
  component: CardParagraph,
  tags: ['autodocs'],
  argTypes: {}
};

export default meta;
type Story = StoryObj<ComponentStoryProps>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Card: Story = {
  render: ({...args}) => {
    return <CardParagraph {...args}/>
  },
  args: {
    paragraph:{
      __typename: 'ParagraphStanfordCard',
      composition: {},
      langcode: {},
      created: {
        offset: "",
        timestamp: Math.round(new Date().getTime() / 1000),
        time: new Date().toISOString(),
        timezone: "America/Los_Angeles"
      },
      id: "9954cc81-919b-4498-9151-bf930831fca7",
      suCardHeader: "Nam scelerisque, urna vitae auctor efficitur, tortor nunc cursus tortor, ut blandit purus arcu quis sapien",
      suCardBody: {
        processed: "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras vitae dignissim felis. Nullam nulla leo, venenatis at feugiat sit amet, ultricies non lorem.</p>"
      },
      suCardLink: {
        title: "Button",
        url: "/",
        internal: true
      },
      suCardMedia: getStoryBookImage(),
      suCardSuperHeader: "Vestibulum"
    }
  }
};
