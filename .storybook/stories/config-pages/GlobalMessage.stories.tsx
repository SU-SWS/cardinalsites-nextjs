import type {Meta, StoryObj} from "@storybook/react"
import GlobalMessage from "@components/config-pages/global-message"
import {ComponentProps} from "react"
import {Link, StanfordGlobalMessage, Text} from "@lib/gql/__generated__/drupal"
import {createMock} from "storybook-addon-module-mock"
import * as gql from "@lib/gql/gql-queries"

type ComponentStoryProps = ComponentProps<typeof GlobalMessage> & {
  messageText?: Text["processed"]
  linkUrl?: Link["url"]
  linkTitle?: Link["title"]
}

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<ComponentStoryProps> = {
  title: "Design/Config Pages/Global Message",
  component: GlobalMessage,
  tags: ["autodocs"],
  argTypes: {},
}

export default meta
type Story = StoryObj<ComponentStoryProps>

const globalMessage = {
  id: "message",
  metatag: [],
  suGlobalMsgEnabled: true,
  suGlobalMsgHeader: "Global Message Header",
  suGlobalMsgLabel: "Global Message Label",
  suGlobalMsgMessage: {
    processed:
      "<p>Erat euismod nunc ipsum morbi tincidunt accumsan bibendum elementum mi vel leo elit urna bibendum sit metus varius leo enim ex tristique amet elit interdum.</p>",
  },
  suGlobalMsgType: "success",
  suGlobalMsgLink: {
    internal: false,
    url: "https://localhost",
    title: "Local Link",
  },
} satisfies StanfordGlobalMessage

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const SuccessMessage: Story = {
  render: ({linkUrl, linkTitle, messageText, ...args}) => {
    return <GlobalMessage {...args} />
  },
  args: {},
  parameters: {
    moduleMock: {
      mock: () => {
        const mock = createMock(gql, "getConfigPage")
        mock.mockReturnValue(Promise.resolve(globalMessage))
        return [mock]
      },
    },
  },
}

export const ErrorMessage: Story = {
  render: ({linkUrl, linkTitle, messageText, ...args}) => {
    return <GlobalMessage {...args} />
  },
  args: {},
  parameters: {
    moduleMock: {
      mock: () => {
        const mock = createMock(gql, "getConfigPage")
        mock.mockReturnValue(Promise.resolve({...globalMessage, suGlobalMsgType: "error"}))
        return [mock]
      },
    },
  },
}

export const InfoMessage: Story = {
  render: ({linkUrl, linkTitle, messageText, ...args}) => {
    return <GlobalMessage {...args} />
  },
  args: {},
  parameters: {
    moduleMock: {
      mock: () => {
        const mock = createMock(gql, "getConfigPage")
        mock.mockReturnValue(Promise.resolve({...globalMessage, suGlobalMsgType: "info"}))
        return [mock]
      },
    },
  },
}

export const WarningMessage: Story = {
  render: ({linkUrl, linkTitle, messageText, ...args}) => {
    return <GlobalMessage {...args} />
  },
  args: {},
  parameters: {
    moduleMock: {
      mock: () => {
        const mock = createMock(gql, "getConfigPage")
        mock.mockReturnValue(Promise.resolve({...globalMessage, suGlobalMsgType: "warning"}))
        return [mock]
      },
    },
  },
}

export const PlainMessage: Story = {
  render: ({linkUrl, linkTitle, messageText, ...args}) => {
    return <GlobalMessage {...args} />
  },
  args: {},
  parameters: {
    moduleMock: {
      mock: () => {
        const mock = createMock(gql, "getConfigPage")
        mock.mockReturnValue(Promise.resolve({...globalMessage, suGlobalMsgType: "plain"}))
        return [mock]
      },
    },
  },
}
