import type {Meta, StoryObj} from '@storybook/react';

import StanfordEventListItem from "@components/nodes/list-item/stanford-event/stanford-event-list-item";
import {EventCard} from "../cards/EventCard.stories";
import {ComponentProps} from "react";
import {NodeStanfordEvent, SmartDateType, TermStanfordEventType} from "@lib/gql/__generated__/drupal";
import {getStoryBookTaxonomyTerm} from "../../storybook-entities";

type ComponentStoryProps = ComponentProps<typeof StanfordEventListItem> & {
  suEventDateTime_start: SmartDateType["value"]
  suEventDateTime_end: SmartDateType["end_value"]
  title: NodeStanfordEvent["title"]
  suEventType?: TermStanfordEventType["name"]
  suEventSubheadline?: NodeStanfordEvent["suEventSubheadline"]
  suEventAltLoc?: NodeStanfordEvent["suEventAltLoc"]
}

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<ComponentStoryProps> = {
  title: 'Design/Nodes/List Item/Event List Item',
  component: StanfordEventListItem,
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
export const EventListItem: Story = {
  render: ({
    title,
    suEventDateTime_start,
    suEventDateTime_end,
    suEventType,
    suEventSubheadline,
    suEventAltLoc,
    node,
    ...args
  }) => {
    node.title = title;
    node.suEventDateTime.value = Math.round(suEventDateTime_start / 1000);
    node.suEventDateTime.end_value = Math.round(suEventDateTime_end / 1000);
    node.suEventType = suEventType ? [getStoryBookTaxonomyTerm(suEventType)] : undefined;
    node.suEventSubheadline = suEventSubheadline;
    node.suEventAltLoc = suEventAltLoc;
    return <StanfordEventListItem node={node} {...args}/>
  },
  args: {...EventCard.args},
};
