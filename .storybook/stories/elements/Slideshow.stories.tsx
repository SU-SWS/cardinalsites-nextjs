import type {Meta, StoryObj} from '@storybook/react';
import Slideshow from "@components/elements/slideshow";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<typeof Slideshow> = {
  title: 'Design/Elements/Slideshow',
  component: Slideshow,
  tags: ['autodocs'],
  argTypes: {}
};

export default meta;
type Story = StoryObj<typeof Slideshow>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const SlideshowElement: Story = {
  args: {
    children: <div></div>
  },
};
