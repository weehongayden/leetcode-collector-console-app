import ora, { Ora } from "ora";
import { QuestionModel } from "types/database";
import { questionGoogleQuery } from "../query/leetcode";
import { DatabaseOption, MenuOption } from "../types/terminal";
import { mapFrequencyToObject } from "../utils/leetcode";

import Database from "./database";
import LeetCode from "./leetcode";
import Notion from "./notion";

class Terminal {
  private _spinner: Ora;
  private _leetcode: LeetCode;
  private _database: Database;
  private _notion: Notion;

  constructor() {
    this._spinner = ora({
      color: "green",
    });
    this._leetcode = new LeetCode();
    this._database = new Database(
      "postgresql://admin:password@localhost:5432/leetcode-question"
    );
    this._notion = new Notion({
      version: "2022-06-28",
      token: "secret_OjAzkQPSYa2dOa3dVkkuAWBIw3EGdhXTgmoDYknp2eD",
    });
  }

  questionMenu = async (answer: string, sessionId: string) => {
    const options: MenuOption = {
      "fetch-google-question-from-leetcode": await this._questionGoogleHandler(
        sessionId
      ),
    };
    return options[answer];
  };

  databaseMenu = async (
    answer: string,
    request: QuestionModel[],
    callback: (length: number) => {},
    databaseId?: string
  ) => {
    console.log(answer);
    const options: DatabaseOption = {
      postgresql: await this._databaseHandler(request, callback),
      notion: await this._notionHandler(request, databaseId!),
    };
    return options[answer];
  };

  private _questionGoogleHandler = async (session: string) => {
    this._leetcode.setSessionId(session);
    this._spinner.text = "Fetching questions from LeetCode";
    this._spinner.start();
    const resp = await this._leetcode.fetchGoogleQuestion(
      JSON.stringify({
        query: questionGoogleQuery,
        variables: {
          slug: "google",
        },
        operationName: "getCompanyTag",
      }),
      this._spinner
    );
    const res = mapFrequencyToObject(resp.data.data.companyTag);
    this._spinner.succeed("Successfully fetched questions from LeetCode");
    return res;
  };

  private _databaseHandler = async (
    questions: QuestionModel[],
    callback: (length: number) => {}
  ) => await this._database.googleQuestion(questions, callback);

  private _notionHandler = async (
    questions: QuestionModel[],
    databaseId: string
  ) => await this._notion.notionGoogleQuestion(databaseId, questions);
}

export default Terminal;
