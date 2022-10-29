import Inquirer from "./core/inquirer";
import Terminal from "./core/terminal";

(async () => {
  console.clear();

  const inquirer = new Inquirer();
  const terminal = new Terminal();

  const { options: selectedOption } = await inquirer.start();
  const { questions, company } = await terminal.questionMenu(selectedOption);
  let res = true;
  while (res) {
    if (selectedOption === "fetch-grind-question") {
      await terminal.grindDatabase({
        questions,
        callback: (res: boolean) => res,
      });
    } else {
      let { database: selectedDatabase } =
        await inquirer.promptDatabaseSelection();
      await terminal.databaseMenu(selectedDatabase, selectedOption, {
        questions,
        company,
        callback: (res: boolean) => res,
      });
    }
  }
  console.log(`${res ? "💕" : "😥"} Outcome: ${res ? "Success" : "Failed"}`);
})();
