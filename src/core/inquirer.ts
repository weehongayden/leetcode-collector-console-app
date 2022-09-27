import inquirer from "inquirer";

class Inquirer {
  constructor() {}

  start = async () =>
    await inquirer.prompt({
      type: "rawlist",
      name: "options",
      message: "What would you like to do?",
      choices: [
        {
          key: "fetch-google-question",
          name: "Fetch Google Question from LeetCode",
          value: "fetch-google-question-from-leetcode",
        },
      ],
    });

  promptSessionId = async () =>
    await inquirer.prompt({
      type: "input",
      name: "session",
      message:
        "Please enter your LeetCode Session ID (CTRL + C to exit the application):",
      validate: (input: string) =>
        input.length == 0 || !input
          ? "LeetCode Session ID cannot be blank."
          : true,
    });

  databaseSelection = async () =>
    await inquirer.prompt({
      type: "rawlist",
      name: "database",
      message: "Where do you want to store the data?",
      choices: [
        {
          key: "postgresql",
          name: "PostgreSQL",
          value: "postgresql",
        },
        {
          key: "notion",
          name: "Notion",
          value: "notion",
        },
        {
          key: "json",
          name: "Json File",
          value: "json",
        },
        {
          key: "exit",
          name: "Exit application",
          value: null,
        },
      ],
    });

  promptDatabaseConnectionString = async () =>
    await inquirer.prompt({
      type: "input",
      name: "connectionString",
      message: "Please enter the database connection string:",
      validate: (input: string) =>
        input.length == 0 || !input
          ? "Database Connection String cannot be blank."
          : true,
    });

  promptNotionPage = async () =>
    await inquirer.prompt({
      type: "input",
      name: "notion",
      message: "Please enter the Notion page Id:",
      validate: (input: string) =>
        input.length == 0 || !input ? "Notion page Id cannot be blank." : true,
    });

  promptNotionDatabase = async () =>
    await inquirer.prompt({
      type: "input",
      name: "notion",
      message: "Please enter the Notion database Id:",
      validate: (input: string) =>
        input.length == 0 || !input
          ? "Notion database Id cannot be blank."
          : true,
    });
}

export default Inquirer;
