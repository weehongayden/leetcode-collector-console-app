import chalk from "chalk";
import ora, { Ora } from "ora";

import {
  createGoogleQuestionDatabase,
  createLeetCodeQuestionDatabase,
} from "../query/notion";
import { FavoriteList, Question } from "types/leetcode";
import { questionGoogleQuery, questionLeetCodeQuery } from "../query/leetcode";
import { DatabaseArgumentsType } from "../types/terminal";
import { convertToString, mapFrequencyToObject } from "../utils/leetcode";

import Database from "./database";
import Inquirer from "./inquirer";
import LeetCode from "./leetcode";
import Notion from "./notion";

class Terminal {
  private _spinner: Ora;
  private _inquirier: Inquirer;
  private _leetcode: LeetCode;
  private _database: Database;
  private _notion: Notion;

  constructor() {
    this._spinner = ora({
      color: "green",
    });
    this._leetcode = new LeetCode();
    this._database = new Database();
    this._notion = new Notion({
      version: "2022-06-28",
    });
    this._inquirier = new Inquirer();
  }

  questionMenu = async (answer: string) => {
    switch (answer) {
      case "fetch-leetcode-question":
      case "fetch-google-question":
        let query =
          answer === "fetch-google-question"
            ? questionGoogleQuery
            : questionLeetCodeQuery;
        const sessionResp = await this._inquirier.promptSessionId();

        let questions = [];

        if (answer === "fetch-google-question") {
          questions = await this._fetchGoogleQuestionHandler(
            sessionResp,
            query
          );
        } else {
          questions = await this._fetchLeetCodeQuestionHandler(
            sessionResp,
            query
          );
        }

        this._spinner.succeed("Successfully fetched questions from LeetCode");

        return questions;
      default:
        process.exit(-1);
    }
  };

  databaseMenu = async (
    answer: string,
    questionType: string,
    args: DatabaseArgumentsType
  ) => {
    switch (answer) {
      case "postgresql":
        return await this._inquirier
          .promptDatabaseConnectionString()
          .then(async (res) => {
            const isActivate = await this._database.setConnectionString(
              res.connectionString
            );

            if (typeof isActivate === "string") {
              this._spinner.fail(
                chalk.red(
                  isActivate.charAt(0).toUpperCase() + isActivate.slice(1)
                )
              );
            }

            const count =
              questionType === "fetch-google-question"
                ? await this._database.googleQuestion(args.questions)
                : await this._database.leetCodeQuestion(args.questions);

            return args.callback(count === args.questions.length);
          });
      case "notion":
        const databaseId = await this._inquirier
          .promptNotionToken()
          .then(async ({ notionToken }) => {
            this._notion.setToken(notionToken);
            const { notionDbExists } =
              await this._inquirier.promptNotionDatabaseExists();
            if (notionDbExists) {
              return await this._inquirier
                .promptNotionDatabase()
                .then(({ notionDb }) => notionDb);
            } else {
              const res = await this._inquirier
                .promptNotionDatabaseCreation()
                .then(({ notionCreation }) => {
                  if (notionCreation) {
                    return this._inquirier
                      .promptNotionPage()
                      .then(async ({ notionPg }) =>
                        questionType === "fetch-google-question"
                          ? await this._notion.createNotionDatabase(
                              createGoogleQuestionDatabase(notionPg)
                            )
                          : await this._notion.createNotionDatabase(
                              createLeetCodeQuestionDatabase(notionPg)
                            )
                      );
                  }
                  return;
                });
              if (res) {
                return res.data.id;
              }
            }
          });
        const count =
          questionType === "fetch-google-question"
            ? await this._notion.notionGoogleQuestionHandler(
                databaseId,
                args.questions,
                this._spinner
              )
            : await this._notion.notionLeetCodeQuestionHandler(
                databaseId,
                args.questions,
                this._spinner
              );

        return args.callback(count === args.questions.length);
      default:
        process.exit(-1);
    }
  };

  private _leetCodeQuestionHandler = async (session: string, query: string) => {
    this._leetcode.setSessionId(session);
    this._spinner.start();
    return await this._leetcode
      .fetchQuestion(query, this._spinner)
      .then((data) => {
        return data;
      });
  };

  private _leetCodeFavoriteQuestionHandler = async (session: string) => {
    this._leetcode.setSessionId(session);
    this._spinner.start();
    return await this._leetcode
      .fetchFavoriteQuestions(this._spinner)
      .then((data) => {
        return data;
      });
  };

  private async _fetchLeetCodeQuestionHandler(
    sessionResp: { session: string } & { [x: string]: {} },
    query: string
  ) {
    this._spinner.text = "Fetching questions from LeetCode";

    const questionResp = await Promise.all([
      await this._leetCodeQuestionHandler(
        sessionResp.session,
        JSON.stringify({
          query,
          variables: {
            categorySlug: "",
            skip: 0,
            limit: -1,
            filters: {},
          },
          operationName: "problemsetQuestionList",
        })
      ),
      await this._leetCodeQuestionHandler(
        sessionResp.session,
        JSON.stringify({
          query: query,
          variables: {
            categorySlug: "",
            skip: 0,
            limit: 1,
            filters: {
              orderBy: "FRONTEND_ID",
              sortOrder: "DESCENDING",
            },
          },
          operationName: "problemsetQuestionList",
        })
      ),
      await this._leetCodeFavoriteQuestionHandler(sessionResp.session),
    ]);

    questionResp[0].data.data.problemsetQuestionList.questions.push(
      ...questionResp[1].data.data.problemsetQuestionList.questions
    );

    questionResp[0].data.data.problemsetQuestionList.questions.forEach(
      (question: Question) => {
        question.topicTagsString = convertToString(question.topicTags);
      }
    );

    this._mapfeaturedLists(
      questionResp[2].data,
      questionResp[0].data.data.problemsetQuestionList.questions
    );

    return questionResp[0].data.data.problemsetQuestionList.questions;
  }

  private async _fetchGoogleQuestionHandler(
    sessionResp: { session: string } & { [x: string]: {} },
    query: string
  ) {
    const questions = await this._leetCodeQuestionHandler(
      sessionResp.session,
      JSON.stringify({
        query: query,
        variables: {
          slug: "google",
        },
        operationName: "getCompanyTag",
      })
    );
    return mapFrequencyToObject(questions.data.data.companyTag);
  }

  private _mapfeaturedLists = (
    favoritesList: FavoriteList[],
    questions: Question[]
  ) => {
    const questionsMap = new Map();

    favoritesList.forEach((list: FavoriteList) => {
      list.questions.map((question) => {
        const set = new Set(questionsMap.get(question));
        set.add(list.name);
        questionsMap.set(question, set);
      });
    });

    questions.forEach((question) => {
      const id = parseInt(question.frontendQuestionId);
      Object.assign(question, {
        featuredList: questionsMap.get(id)
          ? JSON.stringify(Array.from(questionsMap.get(id)))
          : undefined,
      });
    });
  };
}

export default Terminal;
