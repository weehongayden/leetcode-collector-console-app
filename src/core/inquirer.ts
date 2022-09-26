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

  databaseSelection = async () => {
    return await inquirer.prompt({
      type: "list",
      name: "database",
      message: "How do you want to store the data?",
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
          key: "none",
          name: "None",
          value: null,
        },
      ],
    });
  };
}

export default Inquirer;
