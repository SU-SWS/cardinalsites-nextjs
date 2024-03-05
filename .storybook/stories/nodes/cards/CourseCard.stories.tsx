import type {Meta, StoryObj} from '@storybook/react';
import StanfordCourseCard from "@components/nodes/cards/stanford-course/stanford-course-card";
import {StanfordCourseData} from "../StanfordCourse.data";
import {ComponentProps} from "react";
import {NodeStanfordCourse, TermSuCourseSubject} from "@lib/gql/__generated__/drupal";
import {getStoryBookTaxonomyTerm} from "../../storybook-entities";

type ComponentStoryProps = ComponentProps<typeof StanfordCourseCard> & {
  title: NodeStanfordCourse["title"]
  suCourseSubject?: TermSuCourseSubject["name"]
  suCourseCode?: NodeStanfordCourse["suCourseCode"]
  suCourseAcademicYear?: NodeStanfordCourse["suCourseAcademicYear"]
}

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<ComponentStoryProps> = {
  title: 'Design/Nodes/Cards/Course Card',
  component: StanfordCourseCard,
  tags: ['autodocs'],
  argTypes: {
    headingLevel: {
      options: ["h2", "h3"],
      control: {type: "select"}
    },
    node: {
      table: {
        disable: true,
      }
    },
  }
};

export default meta;
type Story = StoryObj<ComponentStoryProps>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const CourseCard: Story = {
  render: ({title, suCourseSubject, suCourseCode, suCourseAcademicYear, node, ...args}) => {
    node.title = title;
    node.suCourseSubject = suCourseSubject ? getStoryBookTaxonomyTerm(suCourseSubject) : undefined;
    node.suCourseCode = suCourseCode;
    node.suCourseAcademicYear = suCourseAcademicYear;
    return <StanfordCourseCard node={node} {...args}/>
  },
  args: {
    title: StanfordCourseData().title,
    suCourseSubject: StanfordCourseData().suCourseSubject?.name,
    suCourseCode: StanfordCourseData().suCourseCode,
    suCourseAcademicYear: StanfordCourseData().suCourseAcademicYear,
    headingLevel: "h2",
    node: StanfordCourseData()
  },
};
