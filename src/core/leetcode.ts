import axios, { AxiosRequestHeaders } from "axios";
import { Ora } from "ora";

class LeetCode {
  private _headers: AxiosRequestHeaders;

  constructor() {
    this._headers = {
      "Content-Type": "application/json",
    };
  }

  setSessionId = (sessionId: string) => {
    Object.assign(this._headers, {
      cookie: `LEETCODE_SESSION=${sessionId}`,
    });
  };

  fetchQuestion = async (requestBody: string, spinner: Ora) =>
    await axios({
      method: "POST",
      url: "https://leetcode.com/graphql",
      data: requestBody,
      headers: this._headers,
      validateStatus: (status: number) => status >= 200 && status < 300,
    })
      .then((resp) => resp)
      .catch((error: unknown) => {
        spinner.fail(`Failed to fetch questions from LeetCode, ${error}`);
        process.exit(-1);
      });

  fetchFavoriteQuestions = async (spinner: Ora) =>
    await axios({
      method: "GET",
      url: "https://leetcode.com/problems/api/favorites/",
      headers: this._headers,
      validateStatus: (status: number) => status >= 200 && status < 300,
    })
      .then((resp) => resp)
      .catch((error: unknown) => {
        spinner.fail(
          `Failed to fetch favorite questions from LeetCode, ${error}`
        );
        process.exit(-1);
      });
}

export default LeetCode;
