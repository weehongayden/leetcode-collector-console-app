import axios, { AxiosRequestHeaders, AxiosResponse } from "axios";
import { Ora } from "ora";
import { QuestionModel } from "types/database";
import { NotionType } from "types/notion";
import chalk from "chalk";

import {
  addGoogleQuestion,
  createGoogleQuestionDatabase,
} from "../query/notion";

class Notion {
  private _headers: AxiosRequestHeaders;

  constructor(notion: NotionType) {
    this._headers = {
      Accept: "application/json",
      "Notion-Version": notion.version,
      "Content-Type": "application/json",
    };
  }

  setToken = (token: string) => {
    Object.assign(this._headers, {
      Authorization: `Bearer ${token}`,
    });
    return Promise.resolve();
  };

  getRecord = async (databaseId: string, filter: {} = {}) => {
    return await axios({
      method: "POST",
      url: `https://api.notion.com/v1/databases/${databaseId}/query`,
      headers: this._headers,
      data: JSON.stringify(filter),
    })
      .then(({ data }) => data)
      .catch((error) => {
        console.log(error);
      });
  };

  createNotionDatabase = async () =>
    await axios({
      method: "POST",
      url: "https://api.notion.com/v1/databases",
      headers: this._headers,
      data: createGoogleQuestionDatabase,
    });

  notionGoogleQuestionHandler = async (
    databaseId: string,
    questions: QuestionModel[],
    spinner: Ora
  ) => {
    const taskList: any = [];
    let count = 0;
    spinner.text = "Adding questions to Notion";
    spinner.start();

    for (const question of questions) {
      let resp;
      spinner.text = `Checking record ${chalk.green(
        question.title
      )} from Notion database`;
      const isExist = await this.getRecord(databaseId, {
        filter: {
          property: "No",
          number: {
            equals: question.frontend_id,
          },
        },
      });
      if (isExist.results.length > 0) {
        spinner.text = `Updating ${chalk.green(question.title)} to Notion`;
        const splitUrl = isExist.results[0].url.split("/");
        const pageId = splitUrl.pop().split("-").pop();

        resp = await this.updateGoogleQuestionFrequency(
          pageId,
          question.frequency,
          spinner
        );
      } else {
        spinner.text = `Adding ${chalk.green(question.title)} to Notion`;
        resp = await this.addGoogleQuestion(databaseId, question, spinner);
      }

      taskList.push(resp);
      count++;
    }
    await Promise.all(taskList);

    spinner.succeed("Operation executed successfully");

    return count;
  };

  addGoogleQuestion = async (
    databaseId: string,
    question: QuestionModel,
    spinner: Ora
  ) => {
    try {
      return await axios({
        method: "POST",
        url: "https://api.notion.com/v1/pages",
        headers: this._headers,
        data: addGoogleQuestion(databaseId, question),
      });
    } catch (e: unknown) {
      spinner.fail("Failed to add questions to Notion");
    }
  };

  updateGoogleQuestionFrequency = async (
    pageId: string,
    frequency: number,
    spinner: Ora
  ) => {
    try {
      return await axios({
        method: "PATCH",
        url: `https://api.notion.com/v1/pages/${pageId}`,
        headers: this._headers,
        data: JSON.stringify({
          properties: {
            Frequency: {
              type: "number",
              number: parseFloat(frequency!.toFixed(2)),
            },
          },
        }),
      });
    } catch (e: unknown) {
      console.log("Error happened on Axios Add Feature List: ", e);
      spinner.fail("Failed to update questions to Notion");
    }
  };
}

export default Notion;
