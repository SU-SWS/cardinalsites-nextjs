import type {Meta, StoryObj} from '@storybook/react';
import Accordion from "@components/elements/accordion";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<typeof Accordion> = {
  title: 'Design/Elements/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  argTypes: {
    button: {
      control: "text"
    },
    onClick: {
      table: {
        disable: true,
      }
    },
    buttonProps: {
      table: {
        disable: true,
      }
    },
    panelProps: {
      table: {
        disable: true,
      }
    },
    isVisible: {
      table: {
        disable: true,
      }
    }
  }
};

export default meta;
type Story = StoryObj<typeof Accordion>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const AccordionElement: Story = {
  render: ({onClick, ...args}) => {
    return <Accordion {...args}/>
  },
  args: {
    button: "Id arcu nec vel tempus rutrum.",
    children: "Mi amet tempus congue erat fusce euismod eros cursus morbi amet amet diam tristique bibendum hendrerit sed commodo quisque cursus scelerisque morbi placerat tristique magna."
  },
};
