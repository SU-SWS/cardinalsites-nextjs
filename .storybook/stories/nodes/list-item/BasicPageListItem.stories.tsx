import type {Meta, StoryObj} from '@storybook/react';

import StanfordPageListItem from "@components/nodes/list-item/stanford-page/stanford-page-list-item";
import {PageCard} from "../cards/BasicPageCard.stories";
import {ComponentProps} from "react";
import {Image, NodeStanfordPage, Text} from "@lib/gql/__generated__/drupal";
import {getStoryBookImage} from "../../storybook-entities";

type ComponentStoryProps = ComponentProps<typeof StanfordPageListItem> & {
  title: NodeStanfordPage["title"]
  suPageImage?: Image["url"]
  suPageDescription?: Text["processed"]
}

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<ComponentStoryProps> = {
  title: 'Design/Nodes/List Item/Stanford Page List Item',
  component: StanfordPageListItem,
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
export const PageListItem: Story = {
  render: ({title, suPageImage, suPageDescription, node, ...args}) => {
    node.suPageImage = suPageImage ? getStoryBookImage(suPageImage) : undefined
    node.title = title;
    node.suPageDescription = suPageDescription;
    return <StanfordPageListItem node={node} {...args}/>
  },
  args: {...PageCard.args},
};
