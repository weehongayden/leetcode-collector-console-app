import chalk from "chalk";
import ora, { Ora } from "ora";
import { questionGoogleQuery, questionLeetCodeQuery } from "../query/leetcode";
import { DatabaseArgumentsType, MenuOption } from "../types/terminal";
import { mapFrequencyToObject } from "../utils/leetcode";

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
      token: "secret_OjAzkQPSYa2dOa3dVkkuAWBIw3EGdhXTgmoDYknp2eD",
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

        if (answer === "fetch-google-question") {
          return await this._fetchGoogleQuestionHandler(sessionResp, query);
        } else {
          return await this._fetchLeetCodeQuestionHandler(sessionResp, query);
        }
      default:
        process.exit(-1);
    }
  };

  databaseMenu = async (answer: string, args: DatabaseArgumentsType) => {
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
            const count = await this._database.googleQuestion(args.questions);
            return args.callback(count === args.questions.length);
          });
      case "notion":
        return await this._inquirier
          .promptNotionDatabase()
          .then(async (res) => {
            if (res.notion) {
              const count = await this._notion.notionGoogleQuestionHandler(
                res.notion,
                args.questions,
                this._spinner
              );
              return args.callback(count === args.questions.length);
            }
          });
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
        this._spinner.succeed("Successfully fetched questions from LeetCode");
        return data;
      });
  };

  private async _fetchLeetCodeQuestionHandler(
    sessionResp: { session: any } & { [x: string]: {} },
    query: string
  ) {
    this._spinner.text = "Fetching questions from LeetCode on ascending order";
    const questions = await this._leetCodeQuestionHandler(
      sessionResp.session,
      JSON.stringify({
        query: query,
        variables: {
          categorySlug: "",
          skip: 0,
          limit: -1,
          filters: {},
        },
        operationName: "problemsetQuestionList",
      })
    );

    this._spinner.text = "Fetching questions from LeetCode on descending order";
    const descResult = await this._leetCodeQuestionHandler(
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
    );

    return questions.data.data.problemsetQuestionList.questions.push(
      ...descResult.data.data.problemsetQuestionList.questions
    );
  }

  private async _fetchGoogleQuestionHandler(
    sessionResp: { session: any } & { [x: string]: {} },
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
}

export default Terminal;
