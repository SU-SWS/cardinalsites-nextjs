import type {Meta, StoryObj} from '@storybook/react';
import StanfordPolicyListItem from "@components/nodes/list-item/stanford-policy/stanford-policy-list-item";
import {PolicyCard} from "../cards/PolicyCard.stories";
import {ComponentProps} from "react";
import {NodeStanfordPolicy, Text} from "@lib/gql/__generated__/drupal";

type ComponentStoryProps = ComponentProps<typeof StanfordPolicyListItem> & {
  title: NodeStanfordPolicy["title"]
  body?: Text["processed"]
}

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<ComponentStoryProps> = {
  title: 'Design/Nodes/List Item/Policy List Item',
  component: StanfordPolicyListItem,
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
export const PolicyListItem: Story = {
  render: ({title, body, node, ...args}) => {
    node.title = title;
    node.body = {processed: body};
    return <StanfordPolicyListItem node={node} {...args}/>
  },
  args: {...PolicyCard.args}
};
