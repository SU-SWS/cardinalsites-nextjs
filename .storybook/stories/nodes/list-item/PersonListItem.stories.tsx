import type {Meta, StoryObj} from '@storybook/react';
import StanfordPersonListItem from "@components/nodes/list-item/stanford-person/stanford-person-list-item";
import {PersonCard} from "../cards/PersonCard.stories";
import {ComponentProps} from "react";
import {Image, NodeStanfordPerson} from "@lib/gql/__generated__/drupal";
import {getStoryBookImage} from "../../storybook-entities";

type ComponentStoryProps = ComponentProps<typeof StanfordPersonListItem> & {
  title: NodeStanfordPerson["title"]
  suPersonPhoto: Image["url"]
  suPersonShortTitle?: NodeStanfordPerson["suPersonShortTitle"]
}

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<ComponentStoryProps> = {
  title: 'Design/Nodes/List Item/Person List Item',
  component: StanfordPersonListItem,
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
export const PersonListItem: Story = {
  render: ({title, suPersonPhoto, suPersonShortTitle, node, ...args}) => {
    node.title = title;
    node.suPersonShortTitle = suPersonShortTitle;
    node.suPersonPhoto = suPersonPhoto ? getStoryBookImage() : undefined;
    return <StanfordPersonListItem node={node} {...args}/>
  },
  args: {...PersonCard.args}
};
