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

const ig = new IgApiClient();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const username = process.env.IG_USERNAME;

let tokenPath = `${__dirname}/token/${username}.json`;

export const fetchingLikers = (state, mediaId) => {
  return new Promise(async (resolve, reject) => {
    ig.state = state;

    ig.media
      .likers("3005310139531361042")
      .then(async (res) => {
        const userIds = [];
        res.users.forEach((user) => userIds.push(user.pk));
        console.log(userIds);
        console.log(userIds.length);

        const array = userIds.slice(0, 30);

        const reelsFeed = ig.feed.reelsMedia({
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
