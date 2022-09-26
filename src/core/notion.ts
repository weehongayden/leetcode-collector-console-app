import axios, { AxiosRequestHeaders } from "axios";
import { QuestionModel } from "types/database";
import { NotionType } from "types/notion";

import { addGoogleQuestion } from "../query/notion";

class Notion {
  private _headers: AxiosRequestHeaders;

  constructor(notion: NotionType) {
    this._headers = {
      Accept: "application/json",
      "Notion-Version": notion.version,
      "Content-Type": "application/json",
      Authorization: `Bearer ${notion.token}`,
    };
  }

  notionGoogleQuestion = async (
    databaseId: string,
    questions: QuestionModel[]
  ) => {
    await Promise.all(
      questions.map((question: QuestionModel) =>
        axios({
          method: "POST",
          url: "https://api.notion.com/v1/pages",
          headers: this._headers,
          data: addGoogleQuestion(databaseId, question),
        })
      )
    );
  };
}

export default Notion;
