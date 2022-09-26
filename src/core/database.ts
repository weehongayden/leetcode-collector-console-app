import ora, { Ora } from "ora";
import { DataTypes, Sequelize } from "sequelize";
import { QuestionModel } from "types/database";

class Database {
  private _sequelize: Sequelize;
  private _dbspinner: Ora;

  constructor(connectionString: string) {
    this._dbspinner = ora({
      color: "green",
    });
    this._sequelize = new Sequelize(connectionString, {
      define: {
        underscored: true,
      },
      logging: false,
    });
  }

  googleQuestion = async (
    questions: QuestionModel[],
    callback: (length: number) => {}
  ) => {
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
      await this._sequelize.authenticate();
      const resp = await model.bulkCreate(questions, {
        updateOnDuplicate: ["status", "frequency", "updated_at"],
      });
      this._dbspinner.succeed(
        `Successfully inserted or updated ${
          Object.keys(resp).length
        } questions into database`
      );
      await this._sequelize.close();
      return await callback(Object.keys(resp).length);
    } catch (error: unknown) {
      this._dbspinner.fail(`Failed to connect to database, ${error}`);
    }
  };
}

export default Database;
