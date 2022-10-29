import puppeteer from "puppeteer";

class Grind {
  private _url: string;
  constructor(
    weeks: number = 8,
    hours: number = 8,
    group: string,
    difficulties?: Array<string>
  ) {
    let difficultiesQuery = "";
    difficulties?.forEach((difficulty: string) => {
      difficultiesQuery += `&difficulty=${difficulty}`;
    });
    this._url = `https://www.techinterviewhandbook.org/grind75?weeks=${weeks}&hours=${hours}${difficultiesQuery}&grouping=${group}`;
  }

  getQuestions = async () => {
    const questions = [];

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox"],
    });
    const page = await browser.newPage();

    await page.goto(this._url);

    const topics = await page.$$("div.bg-white > button");

    if (topics.length > 0) {
      for (const topic of topics) {
        const category = await topic.$eval(
          "div:first-child",
          (f) => f.textContent
        );
        const contents = await topic.$x(
          "..//div[contains(@role, 'list')]//div[contains(@role, 'listitem')]"
        );

        for (const content of contents) {
          const title = await content.$eval(
            "div:nth-child(2) a",
            (c) => c.textContent
          );

          const difficulty = await content.$eval(
            "div:nth-child(2) div:last-child > span:first-child",
            (c) => c.textContent
          );

          let url = await content.$eval("div:nth-child(2) a", (c) =>
            c.getAttribute("href")
          );

          questions.push({
            title,
            difficulty,
            url,
            category,
          });
        }
      }
    }
    browser.close();
    return questions;
  };
}

export default Grind;
