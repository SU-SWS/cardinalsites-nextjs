import type {Meta, StoryObj} from '@storybook/react';
import SelectList from "@components/elements/select-list";


// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<typeof SelectList> = {
  title: 'Design/Elements/Select List',
  component: SelectList,
  tags: ['autodocs'],
  argTypes: {}
};

export default meta;
type Story = StoryObj<typeof SelectList>;


const options = [
  {value: "foo", label: "Foo"},
  {value: "bar", label: "Bar"},
  {value: "baz", label: "Baz"}
];

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const SingleSelect: Story = {
  render: ({...args}) => {
    return <div style={{margin: "50px"}}><SelectList {...args}/></div>
  },
  args: {
    options,
    label: "Single Select",
    name: "single-select"
  },
};

export const RequiredSingleSelect: Story = {
  ...SingleSelect,
  args: {
    options,
    label: "Single Select",
    required: true,
  },
};

export const MultipleSelect: Story = {
  ...SingleSelect,
  args: {
    options,
    label: "Multiple Select",
    multiple: true,
    name: "multi-select"
  },
};
export const RequiredMultipleSelect: Story = {
  ...SingleSelect,
  args: {
    options,
    label: "Multiple Select",
    multiple: true,
    required: true
  },
};