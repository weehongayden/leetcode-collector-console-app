import { QuestionModel } from "./database";

export type DatabaseArgumentsType = {
  questions: QuestionModel[];
  callback: (result: boolean) => {};
};

export type MenuOption = {
  [key: string]: QuestionModel[];
};

export type DatabaseOption = {
  [key: string]: {} | undefined | void;
};
