import type {Meta, StoryObj} from '@storybook/react';
import StanfordPageCard from "@components/nodes/cards/stanford-page/stanford-page-card";
import {StanfordPageData} from "../StanfordPage.data";
import {ComponentProps} from "react";
import {Text, Image, NodeStanfordPage} from "@lib/gql/__generated__/drupal";
import {getStoryBookImage} from "../../storybook-entities";

type ComponentStoryProps = ComponentProps<typeof StanfordPageCard> & {
  title: NodeStanfordPage["title"]
  suPageImage?: Image["url"]
  suPageDescription?: Text["processed"]
}
// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<ComponentStoryProps> = {
  title: 'Design/Nodes/Cards/Stanford Page Card',
  component: StanfordPageCard,
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
export const PageCard: Story = {
  render: ({title, suPageImage, suPageDescription, node, ...args}) => {
    node.suPageImage = suPageImage ? getStoryBookImage(suPageImage) : undefined
    node.title = title;
    node.suPageDescription = suPageDescription;
    return <StanfordPageCard node={node} {...args}/>
  },
  args: {
    suPageImage: "https://placehold.co/2000x1000",
    suPageDescription: StanfordPageData().suPageDescription,
    title: StanfordPageData().title,
    headingLevel: "h2",
    node: StanfordPageData()
  },
};
