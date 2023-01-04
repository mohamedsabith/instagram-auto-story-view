import {
  IgApiClient,
  IgCheckpointError,
  IgLoginRequiredError,
  IgUserHasLoggedOutError,
} from "instagram-private-api";
import path from "path";
import chalk from "chalk";
import { fileURLToPath } from "url";
import { promisify } from "util";
import {
  unlinkSync,
  writeFile,
  existsSync,
  writeFileSync,
  readFileSync,
} from "fs";

const ig = new IgApiClient();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const updateLog = promisify(writeFile);

const username = process.env.IG_USERNAME;

let tokenPath = `${__dirname}/token/${username}.json`;
let logPath = `${__dirname}/logs/${username}.json`;

export const fetchingLikers = (state, mediaId) => {
  return new Promise(async (resolve, reject) => {
    ig.state = state;

    ig.media
      .likers(mediaId)
      .then(async (res) => {
        const userIds = [];

        res.users.forEach((user) => userIds.push(user.pk));

        if (existsSync(logPath)) {
          let logs = readFileSync(logPath, { encoding: "utf-8" });
          let logsParse = JSON.parse(logs);
          let newLogs = logsParse.concat(userIds);
          
          updateLog(logPath, JSON.stringify(newLogs + "")).then(() => {
            let logs = readFileSync(logPath, { encoding: "utf-8" });
            let logsParse = JSON.parse(logs);
            const a = logsParse.split(",");
            let unique = [...new Set(a)];
            console.log(unique.length);
            writeFileSync(logPath, JSON.stringify(unique))
          });
        } else {
          writeFileSync(logPath, JSON.stringify(userIds));
        }

        const array = await userIds.slice(0, 30);

        const reelsFeed = await ig.feed.reelsMedia({
          userIds: array,
        });

        const storyItems = await reelsFeed.items();

        for (var i = 0; i < storyItems.length; i++) {
          ig.story.seen([storyItems[i]]).then((res) => {
            console.log(res);
          });
        }
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
