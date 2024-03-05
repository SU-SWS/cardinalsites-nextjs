import type {Meta, StoryObj} from '@storybook/react';

import StanfordEventSeriesCard from "@components/nodes/cards/stanford-event-series/stanford-event-series-card";
import {StanfordEventSeriesData} from "../StanfordEventSeries.data";
import {ComponentProps} from "react";
import {NodeStanfordEventSeries} from "@lib/gql/__generated__/drupal";

type ComponentStoryProps = ComponentProps<typeof StanfordEventSeriesCard> & {
  title: NodeStanfordEventSeries["title"]
  suEventSeriesDek?: NodeStanfordEventSeries["suEventSeriesDek"]
}

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<ComponentStoryProps> = {
  title: 'Design/Nodes/Cards/Event Series Card',
  component: StanfordEventSeriesCard,
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
export const EventSeriesCard: Story = {
  render: ({title, suEventSeriesDek, node, ...args}) => {
    node.title = title;
    node.suEventSeriesDek = suEventSeriesDek;
    return <StanfordEventSeriesCard node={node} {...args}/>
  },
  args: {
    title: StanfordEventSeriesData().title,
    suEventSeriesDek: StanfordEventSeriesData().suEventSeriesDek,
    headingLevel: "h2",
    node: StanfordEventSeriesData()
  },
};
