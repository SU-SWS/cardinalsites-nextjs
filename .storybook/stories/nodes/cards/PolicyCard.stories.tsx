import type {Meta, StoryObj} from '@storybook/react';

import StanfordPolicyCard from "@components/nodes/cards/stanford-policy/stanford-policy-card";
import {StanfordPolicyData} from "../StanfordPolicy.data";
import {ComponentProps} from "react";
import {NodeStanfordPolicy, Text} from "@lib/gql/__generated__/drupal";

type ComponentStoryProps = ComponentProps<typeof StanfordPolicyCard> & {
  title: NodeStanfordPolicy["title"]
  body?: Text["processed"]
}

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<ComponentStoryProps> = {
  title: 'Design/Nodes/Cards/Policy Card',
  component: StanfordPolicyCard,
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
export const PolicyCard: Story = {
  render: ({title, body, node, ...args}) => {
    node.title = title;
    node.body = {processed: body};
    return <StanfordPolicyCard node={node} {...args}/>
  },
  args: {
    title: StanfordPolicyData().title,
    body: StanfordPolicyData().body?.processed,
    headingLevel: "h2",
    node: StanfordPolicyData()
  },
};
