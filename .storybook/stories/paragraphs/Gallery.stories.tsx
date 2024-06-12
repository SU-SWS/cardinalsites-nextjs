import type {Meta, StoryObj} from "@storybook/react"
import {ComponentProps} from "react"
import GalleryParagraph from "@components/paragraphs/stanford-gallery/gallery-paragraph"
import {getStoryBookGalleryImage} from "../storybook-entities"

type ComponentStoryProps = ComponentProps<typeof GalleryParagraph> & {
  numberofimages: number
}

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<ComponentStoryProps> = {
  title: "Design/Paragraphs/Gallery",
  component: GalleryParagraph,
  tags: ["autodocs"],
  argTypes: {
    numberofimages: {
      control: {
        type: "number",
        min: 1,
        max: 20,
      },
    },
  },
}

export default meta
type Story = StoryObj<ComponentStoryProps>

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Gallery: Story = {
  render: ({numberofimages, paragraph, ...args}) => {
    paragraph.suGalleryImages = []
    for (let i = 0; i < numberofimages; i++) {
      paragraph.suGalleryImages.push(getStoryBookGalleryImage(undefined, "Lorem Ipsum"))
    }
    return (
      <GalleryParagraph
        paragraph={paragraph}
        {...args}
      />
    )
  },
  args: {
    numberofimages: 3,
    paragraph: {
      __typename: "ParagraphStanfordGallery",
      status: true,
      composition: {},
      langcode: {},
      created: {
        offset: "",
        timestamp: Math.round(new Date().getTime() / 1000),
        time: new Date().toISOString(),
        timezone: "America/Los_Angeles",
      },
      id: "1e0c21ee-7cb8-4eff-8877-862d16c9885c",
      suGalleryButton: {
        url: "http://stanford.edu",
        title: "Button text",
        internal: false,
      },
      suGalleryDescription: {
        processed: "<p>Pepper jack fromage frais pecorino cheesecake cheesy grin camembert de normandie macaroni cheese the big cheese.</p>",
      },
      suGalleryHeadline: "This is a Gallery Headline",
      suGalleryImages: [],
    },
  },
}
