export type Question = {
  acRate: number;
  difficulty: string;
  freqBar: number;
  frontendQuestionId: string;
  isFavor: boolean;
  paidOnly: boolean;
  title: string;
  titleSlug: string;
  status: string;
  topicTags: TopicTagsProps[] & string;
  topicTagsString?: string;
  featuredList?: string;
};

export type CompanyTag = {
  name: string;
  questions: GoogleQuestion[];
  frequencies: string;
};

export type GoogleQuestion = {
  status: string;
  questionId: string;
  questionFrontendId: string;
  title: string;
  titleSlug: string;
  translatedTitle?: undefined | string;
  frequency?: number;
  stats: string;
  difficulty: string;
  isPaidOnly: boolean;
  topicTags: TopicTagsProps[];
  __typename: string;
};

export type TopicTagsProps = {
  name: string;
};

export type ProblemsetQuestionList = {
  total: number;
  questions: Question[];
};

export type Data = {
  problemsetQuestionList: ProblemsetQuestionList;
};

export type LeetCodeProps = {
  data: Data;
};

export type FeatureListProps = {
  name: string;
};

export type Frequency = {
  [key: string]: number;
};

export type FavoriteList = {
  id: string;
  name: string;
  questions: number[];
  type: string;
};
