import type {Meta, StoryObj} from "@storybook/react"
import SuperFooter from "@components/config-pages/super-footer"
import {ComponentProps} from "react"
import {StanfordSuperFooter, Text} from "@lib/gql/__generated__/drupal.d"
import {createMock} from "storybook-addon-module-mock"
import * as gql from "@lib/gql/gql-queries"

type ComponentStoryProps = ComponentProps<typeof SuperFooter> & {
  footerHtml?: Text["processed"]
}

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<ComponentStoryProps> = {
  title: "Design/Config Pages/Super Footer",
  component: SuperFooter,
  tags: ["autodocs"],
  argTypes: {},
}

export default meta
type Story = StoryObj<ComponentStoryProps>

const superFooterConfig = {
  id: "super-footer",
  metatag: [],
  suSuperFootEnabled: true,
  suSuperFootIntranet: {title: "suSuperFoot_intranet", url: "http://localhost", internal: false},
  suSuperFootLink: [{title: "suSuperFoot_link", url: "http://localhost", internal: false}],
  suSuperFootText: {processed: "suSuperFoot_text"},
  suSuperFootTitle: "suSuperFoot_title",
} satisfies StanfordSuperFooter

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const SuperFooterDisplay: Story = {
  render: ({footerHtml, ...args}) => {
    return <SuperFooter {...args} />
  },
  args: {},
  parameters: {
    moduleMock: {
      mock: () => {
        const mock = createMock(gql, "getConfigPage")
        mock.mockReturnValue(Promise.resolve(superFooterConfig))
        return [mock]
      },
    },
  },
}
