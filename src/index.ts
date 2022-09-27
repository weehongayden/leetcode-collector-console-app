import Inquirer from "./core/inquirer";
import Terminal from "./core/terminal";

(async () => {
  const inquirer = new Inquirer();
  const terminal = new Terminal();

  const { options: selectedOption } = await inquirer.start();
  const { session } = await inquirer.promptSessionId();
  const questions = await terminal.questionMenu(selectedOption, session);

  let res = true;
  while (res) {
    let { database: selectedDatabase } = await inquirer.databaseSelection();
    const res = await terminal.databaseMenu(selectedDatabase, {
      questions,
      callback: (res: boolean) => res,
    });
    console.log(`💕 Outcome: ${res ? "Success" : "Failed"}`);
  }
})();
