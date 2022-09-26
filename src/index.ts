import axios from "axios";
import Inquirer from "./core/inquirer";
import Terminal from "./core/terminal";

(async () => {
  const inquirer = new Inquirer();
  const terminal = new Terminal();

  const { options: selectedOption } = await inquirer.start();
  const { session } = await inquirer.promptSessionId();
  const question = await terminal.questionMenu(selectedOption, session);
  let { database: selectedDatabase } = await inquirer.databaseSelection();
  const dbResponse = await terminal.databaseMenu(
    selectedDatabase,
    question,
    (resultLength: number) => (resultLength === question.length ? true : false)
  );
  selectedDatabase = await inquirer.databaseSelection();
  await terminal.databaseMenu(
    selectedDatabase,
    question,
    (resultLength: number) => (resultLength === question.length ? true : false),
    "e1989b09-c642-4bf0-9472-fa2f65ef858e"
  );
})();
