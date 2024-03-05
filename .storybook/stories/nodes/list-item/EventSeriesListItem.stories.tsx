import type {Meta, StoryObj} from '@storybook/react';
import StanfordEventSeriesListItem from "@components/nodes/list-item/stanford-event-series/stanford-event-series-list-item";
import {EventSeriesCard} from "../cards/EventSeriesCard.stories";
import {ComponentProps} from "react";
import {NodeStanfordEventSeries} from "@lib/gql/__generated__/drupal";

type ComponentStoryProps = ComponentProps<typeof StanfordEventSeriesListItem> & {
  title: NodeStanfordEventSeries["title"]
  suEventSeriesDek?: NodeStanfordEventSeries["suEventSeriesDek"]
}

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<ComponentStoryProps> = {
  title: 'Design/Nodes/List Item/Event Series List Item',
  component: StanfordEventSeriesListItem,
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
export const EventSeriesListItem: Story = {
  render: ({title, suEventSeriesDek, node, ...args}) => {
    node.title = title;
    node.suEventSeriesDek = suEventSeriesDek;
    return <StanfordEventSeriesListItem node={node} {...args}/>
  },
  args: {...EventSeriesCard.args},
};
