import type {Meta, StoryObj} from "@storybook/react"
import Lockup from "@components/elements/lockup/lockup"
import {ComponentProps} from "react"
import {Image, LockupSetting} from "@lib/gql/__generated__/drupal.d"
import {createMock} from "storybook-addon-module-mock"
import * as gql from "@lib/gql/gql-queries"

type ComponentStoryProps = ComponentProps<typeof Lockup> & {}

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<ComponentStoryProps> = {
  title: "Design/Elements/Lockup",
  component: Lockup,
  tags: ["autodocs"],
  argTypes: {},
}

export default meta
type Story = StoryObj<ComponentStoryProps>

const lockupSettings = {
  id: "foo",
  metatag: [],
  suLockupEnabled: true,
  suLine1: "suLine1",
  suLine2: "suLine2",
  suLine3: "suLine3",
  suLine4: "suLine4",
  suLine5: "suLine5",
  suLockupOptions: "b",
} satisfies LockupSetting

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const LockupDisplay: Story = {
  render: () => {
    return <Lockup />
  },
  args: {},
  parameters: {
    moduleMock: {
      mock: () => {
        const mockGetConfigPage = createMock(gql, "getConfigPage")
        mockGetConfigPage.mockResolvedValue(lockupSettings)

        const mockGetConfigPageField = createMock(gql, "getConfigPageField")
        mockGetConfigPageField.mockResolvedValue("Site Name")
        return [mockGetConfigPage, mockGetConfigPageField]
      },
    },
  },
}

export const LockupA: Story = {
  ...LockupDisplay,
}
export const LockupB: Story = {
  ...LockupDisplay,
}
export const LockupD: Story = {
  ...LockupDisplay,
}
export const LockupE: Story = {
  ...LockupDisplay,
}
export const LockupH: Story = {
  ...LockupDisplay,
}
export const LockupI: Story = {
  ...LockupDisplay,
}
export const LockupM: Story = {
  ...LockupDisplay,
}
export const LockupO: Story = {
  ...LockupDisplay,
}
export const LockupP: Story = {
  ...LockupDisplay,
}
export const LockupR: Story = {
  ...LockupDisplay,
}
export const LockupS: Story = {
  ...LockupDisplay,
}
export const LockupT: Story = {
  ...LockupDisplay,
}
export const LockupNone: Story = {
  ...LockupDisplay,
}
