import type {Meta, StoryObj} from '@storybook/react';
import StanfordEventCard from "@components/nodes/cards/stanford-event/stanford-event-card";
import {StanfordEventData} from "../StanfordEvent.data";
import {ComponentProps} from "react";
import {NodeStanfordEvent, SmartDateType, TermStanfordEventType} from "@lib/gql/__generated__/drupal";
import {getStoryBookTaxonomyTerm} from "../../storybook-entities";

type ComponentStoryProps = ComponentProps<typeof StanfordEventCard> & {
  suEventDateTime_start: SmartDateType["value"]
  suEventDateTime_end: SmartDateType["end_value"]
  title: NodeStanfordEvent["title"]
  suEventType?: TermStanfordEventType["name"]
  suEventSubheadline?: NodeStanfordEvent["suEventSubheadline"]
  suEventAltLoc?: NodeStanfordEvent["suEventAltLoc"]
}

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<ComponentStoryProps> = {
  title: 'Design/Nodes/Cards/Event Card',
  component: StanfordEventCard,
  tags: ['autodocs'],
  argTypes: {
    headingLevel: {
      options: ["h2", "h3"],
      control: {type: "select"}
    },
    suEventDateTime_start: {
      control: "date"
    },
    suEventDateTime_end: {
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
export const EventCard: Story = {
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
    return <StanfordEventCard node={node} {...args}/>
  },
  args: {
    title: StanfordEventData().title,
    suEventDateTime_start: new Date().getTime(),
    suEventDateTime_end: new Date().getTime(),
    suEventType: StanfordEventData().suEventType?.[0].name,
    suEventSubheadline: StanfordEventData().suEventSubheadline,
    suEventAltLoc: StanfordEventData().suEventAltLoc,
    headingLevel: "h2",
    node: StanfordEventData()
  },
};
