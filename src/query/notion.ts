import { QuestionModel } from "types/database";
import { Question, TopicTagsProps } from "types/leetcode";

export const createLeetCodeQuestionDatabase = (id: string) => {
  return {
    properties: {
      Tag: {
        name: "Tag",
        type: "multi_select",
        multi_select: {
          options: [],
        },
      },
      Progress: {
        name: "Progress",
        type: "select",
        select: {
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
      "Featured List": {
        name: "Featured List",
        type: "multi_select",
        multi_select: {
          options: [],
        },
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
          content: "LeetCode Question",
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
      page_id: id,
    },
  };
};

export const createGoogleQuestionDatabase = (id: string) => {
  return {
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
      page_id: id,
    },
  };
};

export const addLeetCodeQuestion = (id: string, question: Question) => {
  return {
    properties: {
      No: {
        type: "number",
        number: parseInt(question.frontendQuestionId),
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
                url: `https://leetcode.com/problems/${question.titleSlug}`,
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
            href: `https://leetcode.com/problems/${question.titleSlug}`,
          },
        ],
      },
      Difficulty: {
        select: {
          name: question.difficulty,
        },
      },
      Progress: {
        type: "select",
        select: null,
      },
      Frequency: {
        type: "number",
        number: parseFloat(question.freqBar!.toFixed(2)),
      },
      Tag: {
        type: "multi_select",
        multi_select: question.topicTags.map((tag: TopicTagsProps) => {
          return {
            name: tag.name,
          };
        }),
      },
      "Featured List": {
        type: "multi_select",
        multi_select: question.featuredList
          ? JSON.parse(question.featuredList).map((list: string) => {
              return {
                name: list,
              };
            })
          : [],
      },
    },
    parent: {
      database_id: id,
    },
  };
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
      Completed: {
        type: "checkbox",
        checkbox: question.status === "ac" ? true : false,
      },
    },
    parent: {
      database_id: id,
    },
  };
};
