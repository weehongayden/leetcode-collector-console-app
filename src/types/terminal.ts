import { QuestionModel } from "./database";

export type MenuOption = {
  [key: string]: QuestionModel[];
};

export type DatabaseOption = {
  [key: string]: {} | undefined | void;
};
