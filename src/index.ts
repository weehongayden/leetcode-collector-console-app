import Inquirer from "./core/inquirer";
import Terminal from "./core/terminal";

(async () => {
  console.clear();

  const inquirer = new Inquirer();
  const terminal = new Terminal();

  const { options: selectedOption } = await inquirer.start();
  const questions = await terminal.questionMenu(selectedOption);

  let res = true;
  while (res) {
    let { database: selectedDatabase } = await inquirer.databaseSelection();
    const res = await terminal.databaseMenu(selectedDatabase, selectedOption, {
      questions,
      callback: (res: boolean) => res,
    });
    console.log(`💕 Outcome: ${res ? "Success" : "Failed"}`);
  }
})();
