import type {Meta, StoryObj} from '@storybook/react';
import Oembed from "@components/elements/ombed";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<typeof Oembed> = {
  title: 'Design/Elements/Oembed',
  component: Oembed,
  tags: ['autodocs'],
  argTypes: {}
};

export default meta;
type Story = StoryObj<typeof Oembed>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const OembedElement: Story = {
  args: {
    "url": "https://www.youtube.com/watch?v=9P8mASSREYM"
  },
};
