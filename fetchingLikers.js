import {
  IgApiClient,
  IgCheckpointError,
  IgLoginRequiredError,
  IgUserHasLoggedOutError,
} from "instagram-private-api";
import chalk from "chalk";
import { removeToken } from "./removeToken.js";

const ig = new IgApiClient();

export const fetchPostLikers = (state) => {
  return new Promise(async (resolve, reject) => {
    try {
      ig.state = state;

      let allUsers = [];

      const userFeed = ig.feed.timeline(ig.state.cookieUserId);

      const feedItems = await userFeed.items().catch((error) => {
        if (
          error instanceof IgLoginRequiredError ||
          error instanceof IgUserHasLoggedOutError ||
          error instanceof IgCheckpointError
        ) {
          removeToken();
        }
      });
      for (const feedItem of feedItems) {
        if (!feedItem.has_liked) {
          let { status } = await ig.media
            .like({
              mediaId: feedItem.id,
              moduleInfo: { module_name: "feed_timeline" },
              d: 0,
            })
            .catch((error) => {
              console.log(chalk.red(error.message));

              console.log(chalk.redBright("Post like failed."));

              if (
                error instanceof IgLoginRequiredError ||
                error instanceof IgUserHasLoggedOutError ||
                error instanceof IgCheckpointError
              ) {
                removeToken();
              }
            });

          if (status) {
            console.log(
              chalk.green(
                `Post liked successfully ===> ${feedItem.user.username} `
              )
            );

            const likers = await ig.media.likers(feedItem.id);

            let users = likers.users;

            users.forEach((user) => {
              allUsers.push(user);
            });

            break;
          }
        }
      }

      return resolve(allUsers);
    } catch (error) {
      return reject(error);
    }
  });
};
