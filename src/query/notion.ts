import { QuestionModel } from "types/database";
import { TopicTagsProps } from "types/leetcode";

export const createGoogleQuestionDatabase = {
  properties: {
    Tag: {
      name: "Tag",
      type: "multi_select",
      multi_select: {
        options: [],
      },
    },
    Difficulty: {
      name: "Difficulty",
      type: "select",
      select: {
        options: [],
      },
    },
    Frequency: {
      name: "Frequency",
      type: "number",
      number: {
        format: "number",
      },
    },
    No: {
      name: "No",
      type: "number",
      number: {
        format: "number",
      },
    },
    Name: {
      name: "Name",
      type: "title",
      title: {},
    },
    Completed: {
      name: "Completed",
      type: "checkbox",
      checkbox: {},
    },
    "Completion Date": {
      name: "Completion Date",
      type: "formula",
      formula: {
        expression:
          '(prop("Completed") == true) ? now() : fromTimestamp(toNumber(""))',
      },
    },
  },
  title: [
    {
      type: "text",
      text: {
        content: "LeetCode Google Question",
        link: null,
      },
      annotations: {
        bold: false,
        italic: false,
        strikethrough: false,
        underline: false,
        code: false,
        color: "default",
      },
      plain_text: "LeetCode Question",
      href: null,
    },
  ],
  icon: {
    type: "external",
    external: {
      url: "https://upload.wikimedia.org/wikipedia/commons/1/19/LeetCode_logo_black.png",
    },
  },
  parent: {
    type: "page_id",
    page_id: process.env.NOTION_PAGE,
  },
};

export const addGoogleQuestion = (id: string, question: QuestionModel) => {
  return {
    properties: {
      No: {
        type: "number",
        number: question.frontend_id,
      },
      Name: {
        id: "title",
        type: "title",
        title: [
          {
            type: "text",
            text: {
              content: question.title,
              link: {
                url: `https://leetcode.com/problems/${question.slug}`,
              },
            },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: "default",
            },
            plain_text: question.title,
            href: `https://leetcode.com/problems/${question.slug}`,
          },
        ],
      },
      Difficulty: {
        select: {
          name: question.difficulty,
        },
      },
      Frequency: {
        type: "number",
        number: parseFloat(question.frequency!.toFixed(2)),
      },
      Tag: {
        type: "multi_select",
        multi_select: JSON.parse(question.tags).map((tag: TopicTagsProps) => {
          return {
            name: tag.name,
          };
        }),
      },
    },
    parent: {
      database_id: id,
    },
  };
};
