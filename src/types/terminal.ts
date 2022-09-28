import { QuestionModel } from "./database";
import { Question } from "./leetcode";

export type DatabaseArgumentsType = {
  questions: Question[] & QuestionModel[];
  callback: (result: boolean) => {};
};

export type MenuOption = {
  [key: string]: QuestionModel[];
};

export type DatabaseOption = {
  [key: string]: {} | undefined | void;
};
