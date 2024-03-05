import type {Meta, StoryObj} from '@storybook/react';
import SuperFooter from "@components/config-pages/super-footer";
import {ComponentProps} from "react";
import {Text} from "@lib/gql/__generated__/drupal";

type ComponentStoryProps = ComponentProps<typeof SuperFooter> & {
  footerHtml?: Text["processed"]
}

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<ComponentStoryProps> = {
  title: 'Design/Config Pages/Super Footer',
  component: SuperFooter,
  tags: ['autodocs'],
  argTypes: {
    suSuperFootEnabled: {control: "boolean"}
  }
};

export default meta;
type Story = StoryObj<ComponentStoryProps>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const SuperFooterDisplay: Story = {
  render: ({footerHtml, ...args}) => {
    if (footerHtml) args.suSuperFootText = {processed: footerHtml}
    return <SuperFooter {...args}/>
  },
  args: {
    suSuperFootEnabled: true,
    suSuperFootIntranet: {title: "suSuperFoot_intranet", url: "http://localhost", internal: false},
    suSuperFootLink: [{title: "suSuperFoot_link", url: "http://localhost", internal: false}],
    footerHtml: "suSuperFoot_text",
    suSuperFootTitle: "suSuperFoot_title",
  },
};
