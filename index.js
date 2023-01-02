import { IgApiClient } from "instagram-private-api";
import {
  existsSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
  mkdirSync,
} from "fs";
import path from 'path'
import { fileURLToPath } from "url";
import chalk from "chalk";
import "dotenv/config";
import { webApiCookie } from "./cookie.js";
import { fetchingUserIds } from "./fetchingUserIds.js";

const ig = new IgApiClient();

const username = process.env.IG_USERNAME;
const password = process.env.IG_PASSWORD;

ig.state.generateDevice(username);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let tokenPath = `${__dirname}/token/${username}.json`;
let tokenDirectory = `${__dirname}/token`;

if (!existsSync(tokenDirectory)) {
  mkdirSync(tokenDirectory);
}

if (!existsSync(tokenPath)) {
  await ig.account.login(username, password).catch((error) => {
    console.log(chalk.red(error.message));
    console.log(chalk.red("Login failed try again !."));
    process.exit();
  });

  console.log(chalk.green("successfully logged in."));

  console.log(chalk.yellow("Saving token"));

  const serialized = await ig.state.serialize();
  delete serialized.constants;
  writeFileSync(tokenPath, JSON.stringify(serialized));

  fetchingUserIds(ig.state)
    .then((userIds) => console.log(userIds))
    .catch((err) => console.log(err));
} else {
  console.log(chalk.yellowBright("Token exist."));

  let token = readFileSync(tokenPath, { encoding: "utf-8" });
  await ig.state.deserialize(token);
  console.log(chalk.green("successfully logged in."));
}
