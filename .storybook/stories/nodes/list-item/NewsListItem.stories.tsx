import type {Meta, StoryObj} from '@storybook/react';
import StanfordNewsListItem from "@components/nodes/list-item/stanford-news/stanford-news-list-item";
import {NewsCard} from "../cards/NewsCard.stories";
import {ComponentProps} from "react";
import {getStoryBookImage, getStoryBookTaxonomyTerm} from "../../storybook-entities";
import {DateTime, Image, NodeStanfordNews, TermStanfordNewsTopic} from "@lib/gql/__generated__/drupal";

type ComponentStoryProps = ComponentProps<typeof StanfordNewsListItem> & {
  title: NodeStanfordNews["title"]
  suNewsFeaturedMedia?: Image["url"]
  suNewsTopics?: TermStanfordNewsTopic["name"][]
  suNewsPublishingDate?: DateTime["timestamp"]
}

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<ComponentStoryProps> = {
  title: 'Design/Nodes/List Item/News List Item',
  component: StanfordNewsListItem,
  tags: ['autodocs'],
  argTypes: {
    headingLevel: {
      options: ["h2", "h3"],
      control: {type: "select"}
    },
    suNewsPublishingDate: {
      control: "date"
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
export const NewsListItem: Story = {
  render: ({title, suNewsPublishingDate, suNewsFeaturedMedia, suNewsTopics, node, ...args}) => {
    node.title = title;
    if (suNewsPublishingDate) node.suNewsPublishingDate = {
      offset: "",
      timestamp: Math.round(new Date(suNewsPublishingDate).getTime() / 1000),
      time: new Date(suNewsPublishingDate).toISOString(),
      timezone: "America/Los_Angeles",
    }
    node.suNewsFeaturedMedia = suNewsFeaturedMedia ? getStoryBookImage() : undefined

    node.suNewsTopics = [];
    if (suNewsTopics) {
      suNewsTopics.map(name => {
        node.suNewsTopics?.push(getStoryBookTaxonomyTerm(name))
      })
    }
    return <StanfordNewsListItem node={node} {...args}/>
  },
  args: {...NewsCard.args}
};
