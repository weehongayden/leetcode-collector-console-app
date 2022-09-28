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
          key: "fetch-leetcode-question",
          name: "Fetch All the LeetCode Questions",
          value: "fetch-leetcode-question",
        },
        {
          key: "fetch-google-question",
          name: "Fetch Google Question from LeetCode",
          value: "fetch-google-question",
        },
        {
          key: "exit",
          name: "Exit",
          value: "exit",
        },
      ],
    });

  promptSessionId = async () =>
    await inquirer.prompt({
      type: "password",
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
          key: "exit",
          name: "Exit",
          value: "exit",
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

  promptNotionToken = async () =>
    await inquirer.prompt({
      type: "password",
      name: "notionToken",
      message: "Please enter the Notion token:",
      validate: (input: string) =>
        input.length == 0 || !input ? "Notion token cannot be blank." : true,
    });

  promptNotionDatabaseExists = async () =>
    await inquirer.prompt({
      type: "confirm",
      name: "notionDbExists",
      message: "Do you have existing database:",
    });

  promptNotionDatabaseCreation = async () =>
    await inquirer.prompt({
      type: "confirm",
      name: "notionCreation",
      message: "Do you want to create a new Notion database:",
    });

  promptNotionPage = async () =>
    await inquirer.prompt({
      type: "input",
      name: "notionPg",
      message: "Please enter the Notion page Id:",
      validate: (input: string) =>
        input.length == 0 || !input ? "Notion page Id cannot be blank." : true,
    });

  promptNotionDatabase = async () =>
    await inquirer.prompt({
      type: "input",
      name: "notionDb",
      message: "Please enter the Notion database Id:",
      validate: (input: string) =>
        input.length == 0 || !input
          ? "Notion database Id cannot be blank."
          : true,
    });
}

export default Inquirer;
