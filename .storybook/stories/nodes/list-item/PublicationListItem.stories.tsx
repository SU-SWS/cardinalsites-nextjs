import type {Meta, StoryObj} from '@storybook/react';
import StanfordPublicationListItem from "@components/nodes/list-item/stanford-publication/stanford-publication-list-item";
import {PublicationCard} from "../cards/PublicationCard.stories";
import {ComponentProps} from "react";
import {getStoryBookTaxonomyTerm} from "../../storybook-entities";
import {NodeStanfordPublication, TermStanfordPublicationTopic} from "@lib/gql/__generated__/drupal";

type ComponentStoryProps = ComponentProps<typeof StanfordPublicationListItem> & {
  title: NodeStanfordPublication["title"]
  suPublicationTopics?: TermStanfordPublicationTopic["name"][]
}

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<ComponentStoryProps> = {
  title: 'Design/Nodes/List Item/Publication List Item',
  component: StanfordPublicationListItem,
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
export const PublicationListItem: Story = {
  render: ({title, suPublicationTopics, node, ...args}) => {
    node.title = title
    node.suPublicationTopics = []
    if (suPublicationTopics) {
      suPublicationTopics.map(name => node.suPublicationTopics?.push(getStoryBookTaxonomyTerm(name)))
    }
    return <StanfordPublicationListItem node={node} {...args}/>
  },
  args: {...PublicationCard.args}
};
