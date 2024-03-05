import type {Meta, StoryObj} from '@storybook/react';
import GlobalMessage from "@components/config-pages/global-message";
import {ComponentProps} from "react";
import {Link, Text} from "@lib/gql/__generated__/drupal";

type ComponentStoryProps = ComponentProps<typeof GlobalMessage> & {
  messageText?: Text["processed"]
  linkUrl?: Link["url"]
  linkTitle?: Link["title"]
}

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<ComponentStoryProps> = {
  title: 'Design/Config Pages/Global Message',
  component: GlobalMessage,
  tags: ['autodocs'],
  argTypes: {
    suGlobalMsgType: {
      options: ['info', 'success', 'warning', 'error', 'plain'],
      control: {type: 'select'}
    },
    suGlobalMsgEnabled: {control: "boolean"}
  }
};

export default meta;
type Story = StoryObj<ComponentStoryProps>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const SuccessMessage: Story = {
  render: ({linkUrl, linkTitle, messageText, ...args}) => {
    if (messageText) args.suGlobalMsgMessage = {processed: messageText}
    if (linkUrl && linkTitle) args.suGlobalMsgLink = {url: linkUrl, title: linkTitle, internal: false}
    return <GlobalMessage {...args}/>
  },
  args: {
    suGlobalMsgType: 'success',
    messageText: '<p>Rutrum nec ipsum lacus portaest cursus orci dolor gravida gravida eget nulla ipsum elementum leo enim vivamus quam lorem tempus quis cursus sem nec pellentesque. <a href="#">Link text</a></p><p><a class="su-button" href="#">Button text</a></p><p><a class="su-button--secondary" href="#">Secondary text</a></p>',
    suGlobalMsgLabel: 'Placerat lacus ut eget leo.',
    suGlobalMsgHeader: 'Accumsan eget amet id sollicitudin.',
    linkTitle: 'Sem quisque placerat quis suspendisse.',
    linkUrl: '#',
    suGlobalMsgEnabled: true,
  },
};
