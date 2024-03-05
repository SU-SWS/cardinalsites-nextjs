import {NodeStanfordCourse} from "@lib/gql/__generated__/drupal";

export const StanfordCourseData = () => {
  return {
    __typename: 'NodeStanfordCourse',
    id: 'f121f36b-a993-4386-80a2-12c67fa3fb53',
    title: 'Tennis: Advanced Beginning',
    status: true,
    path: '/courses/physwell27',
    changed: {
      timezone: 'America/Los_Angeles',
      time: '2023-08-18T13:32:57-07:00'
    },
    created: {
      timezone: 'America/Los_Angeles',
      time: '2023-07-21T10:47:31-07:00'
    },
    body: {
      processed: 'Students will review and strengthen stroke techniques with emphasis on control, depth, and direction.  This course will also incorporate rules, etiquette, and basic strategy and tactics. This course will utilize class discussions, class assignments and student participation to enable students to: (1) Understand basic components of health-related physical fitness, cardiovascular fitness, muscular strength and endurance and flexibility (2) Develop physical fitness and motor skills, and (3) Develop a positive attitude toward wellness and physical activity which will facilitate a healthy lifestyle. Prerequisites: 26, or knowledge of rules and scoring and average ability in fundamental strokes but limited playing experience.'
    },
    suCourseAcademicYear: '2023-2024',
    suCourseCode: '27',
    suCourseId: 102675,
    suCourseInstructors: ['Thornton, M.', 'Lee, S.', 'Fendrick, L.'],
    suCourseLink: {
      url: 'http://explorecourses.stanford.edu/search?q=PHYSWELL27',
      title: ''
    },
    suCourseQuarters: [
      {
        __typename: 'TermSuCourseQuarter',
        id: '68944821-ab8c-4f0c-98f7-f5242ab89ddf',
        name: 'Winter',
        path: '/courses/winter',
        weight: 0,
        parent: null
      },
      {
        __typename: 'TermSuCourseQuarter',
        id: '1e2402c2-f27e-4fc8-be1b-63768929de94',
        name: 'Spring',
        path: '/courses/spring',
        weight: 0,
        parent: null
      }
    ],
    suCourseSectionUnits: '1',
    suCourseSubject: {
      __typename: 'TermSuCourseSubject',
      id: '2a30758d-f296-4d32-b07e-2dc02582cddf',
      name: 'PHYSWELL',
      path: '/courses/physwell',
      weight: 0,
      parent: null
    },
    suCourseTags: null
  } as unknown as NodeStanfordCourse;
}