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

  fetchGoogleQuestion = async (requestBody: string, spinner: Ora) =>
    await axios({
      method: "POST",
      url: "https://leetcode.com/graphql",
      data: requestBody,
      headers: this._headers,
      validateStatus: (status: number) => status >= 200 && status < 300,
    })
      .then((resp) => resp)
      .catch((error) => {
        spinner.fail("Failed to fetch questions from LeetCode");
        process.exit(-1);
      });
}

export default LeetCode;
