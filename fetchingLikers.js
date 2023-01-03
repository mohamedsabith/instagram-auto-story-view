import {
  IgApiClient,
  IgCheckpointError,
  IgLoginRequiredError,
  IgUserHasLoggedOutError,
} from "instagram-private-api";
import path from "path";
import chalk from "chalk";
import { fileURLToPath } from "url";
import { unlinkSync } from "fs";
import { fetchingStories } from "./fetchingStories.js";

const ig = new IgApiClient();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const username = process.env.IG_USERNAME;

let tokenPath = `${__dirname}/token/${username}.json`;

export const fetchingLikers = (state) => {
  return new Promise(async (resolve, reject) => {
    ig.state = state;

    const serialized = await ig.state.serialize();
    delete serialized.constants;

    ig.media
      .likers("3005310139531361042")
      .then((res) => {
        fetchingStories(res.users, JSON.stringify(serialized))
          .then((result) => {
            resolve(result);
          })
          .catch((error) => {
            if (
              error instanceof IgLoginRequiredError ||
              error instanceof IgUserHasLoggedOutError ||
              error instanceof IgCheckpointError
            ) {
              unlinkSync(tokenPath);
              console.log(
                chalk.red("account relogin required.", "Fetching Likers")
              );
              process.exit();
            }
            console.log(chalk.red(error.message, "Fetching Likers"));
            reject(error);
          });
      })
      .catch((error) => {
        if (
          error instanceof IgLoginRequiredError ||
          error instanceof IgUserHasLoggedOutError ||
          error instanceof IgCheckpointError
        ) {
          unlinkSync(tokenPath);
          console.log(
            chalk.red("account relogin required.", "Fetching Likers")
          );
          process.exit();
        }
        console.log(chalk.red(error.message, "Fetching Likers"));
        reject(error);
      });
  });
};
