import type {Meta, StoryObj} from '@storybook/react';

import StanfordPersonCard from "@components/nodes/cards/stanford-person/stanford-person-card";
import {StanfordPersonData} from "../StanfordPerson.data";
import {ComponentProps} from "react";
import {Image, NodeStanfordPerson} from "@lib/gql/__generated__/drupal";
import {getStoryBookImage} from "../../storybook-entities";

type ComponentStoryProps = ComponentProps<typeof StanfordPersonCard> & {
  title: NodeStanfordPerson["title"]
  suPersonPhoto: Image["url"]
  suPersonShortTitle?: NodeStanfordPerson["suPersonShortTitle"]
}

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<ComponentStoryProps> = {
  title: 'Design/Nodes/Cards/Person Card',
  component: StanfordPersonCard,
  tags: ['autodocs'],
  argTypes: {
    headingLevel: {
      options: ["h2", "h3"],
      control: {type: "select"}
    },
    node: {
      table: {
        disable: true,
      }
    },
  }
};

export default meta;
type Story = StoryObj<ComponentStoryProps>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const PersonCard: Story = {
  render: ({title, suPersonPhoto, suPersonShortTitle, node, ...args}) => {
    node.title = title;
    node.suPersonShortTitle = suPersonShortTitle;
    node.suPersonPhoto = suPersonPhoto ? getStoryBookImage() : undefined;
    return <StanfordPersonCard node={node} {...args}/>
  },
  args: {
    title: StanfordPersonData().title,
    suPersonPhoto: "image",
    suPersonShortTitle: StanfordPersonData().suPersonShortTitle,
    headingLevel: "h2",
    node: StanfordPersonData()
  },
};
