import type {Meta, StoryObj} from '@storybook/react';

import StanfordCourseListItem from "@components/nodes/list-item/stanford-course/stanford-course-list-item";
import {CourseCard} from "../cards/CourseCard.stories";
import {ComponentProps} from "react";
import {NodeStanfordCourse, TermSuCourseSubject} from "@lib/gql/__generated__/drupal";
import {getStoryBookTaxonomyTerm} from "../../storybook-entities";

type ComponentStoryProps = ComponentProps<typeof StanfordCourseListItem> & {
  title: NodeStanfordCourse["title"]
  suCourseSubject?: TermSuCourseSubject["name"]
  suCourseCode?: NodeStanfordCourse["suCourseCode"]
  suCourseAcademicYear?: NodeStanfordCourse["suCourseAcademicYear"]
}

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<ComponentStoryProps> = {
  title: 'Design/Nodes/List Item/Course List Item',
  component: StanfordCourseListItem,
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
export const CourseListItem: Story = {
  render: ({title, suCourseSubject, suCourseCode, suCourseAcademicYear, node, ...args}) => {
    node.title = title;
    node.suCourseSubject = suCourseSubject ? getStoryBookTaxonomyTerm(suCourseSubject) : undefined;
    node.suCourseCode = suCourseCode;
    node.suCourseAcademicYear = suCourseAcademicYear;
    return <StanfordCourseListItem node={node} {...args}/>
  },
  args: {...CourseCard.args},
};
