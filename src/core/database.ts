import chalk from "chalk";
import ora, { Ora } from "ora";
import { DataTypes, Options, Sequelize } from "sequelize";
import { QuestionModel } from "types/database";

class Database {
  private _sequelize: Sequelize;
  private _config: Options;
  private _dbspinner: Ora;

  constructor() {
    this._dbspinner = ora({
      color: "green",
    });
    this._config = {
      define: {
        underscored: true,
      },
      logging: false,
    };
  }

  setConnectionString = async (connectionString: string) => {
    try {
      this._sequelize = new Sequelize(connectionString, this._config);
      await this._sequelize.authenticate();
      return true;
    } catch (error: any) {
      return error.message;
    }
  };

  googleQuestion = async (questions: QuestionModel[]) => {
    try {
      const model = this._sequelize.define("google_questions", {
        frontend_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        title_translated: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        slug: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        difficulty: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        frequency: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
        tags: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        stats: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        status: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        is_paid_only: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
        },
      });

      this._dbspinner.start();
      const resp = await model.bulkCreate(questions, {
        updateOnDuplicate: ["status", "frequency", "updated_at"],
      });

      this._dbspinner.succeed(
        chalk.green(
          `Successfully inserted or updated ${
            Object.keys(resp).length
          } questions into database`
        )
      );

      await this._sequelize.close();
      return await Object.keys(resp).length;
    } catch (error: unknown) {
      this._dbspinner.fail(`Failed to connect to database, ${error}`);
    }
  };
}

export default Database;
