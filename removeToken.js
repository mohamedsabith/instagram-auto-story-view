import { unlinkSync } from "fs";
import chalk from "chalk";
import path from "path";
import { fileURLToPath } from "url";

const username = process.env.IG_USERNAME;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let tokenPath = `${__dirname}/token/${username}.json`;

export const removeToken = () => {
  try {
    console.log(chalk.yellow("Token removing....."));
    unlinkSync(tokenPath);
    console.log(chalk.red("account relogin required."));
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit();
  }
};
