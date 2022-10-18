import { QuestionModel } from "types/database";
import { CompanyTag, Frequency, GoogleQuestion } from "../types/leetcode";

export const mapFrequencyToObject = (company: CompanyTag) => {
  const mapObject: QuestionModel[] = [];

  const frequencies = JSON.parse(company.frequencies);
  Object.entries<Frequency>(frequencies).forEach(([key, v]) => {
    company.questions.forEach((q: GoogleQuestion) => {
      if (key === q.questionId) {
        mapObject.push({
          frontend_id: parseInt(q.questionFrontendId),
          title: q.title,
          title_translated: q.translatedTitle,
          slug: q.titleSlug,
          frequency: v[7],
          stats: JSON.stringify(q.stats),
          difficulty: q.difficulty,
          is_paid_only: q.isPaidOnly,
          tags: JSON.stringify(q.topicTags),
          status: q.status,
        });
      }
    });
  });

  return mapObject;
};

export const convertToString = (questions: [] | object) => {
  return JSON.stringify(questions);
};

export const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}