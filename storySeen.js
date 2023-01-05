import { IgApiClient } from "instagram-private-api";
import lodash from "lodash";
import count from './count.js'

export const storySeen = async (users, state) => {
  try {
    const ig = new IgApiClient();
    ig.state = state;

    const userIds = [];

    users.forEach((user) => {
      userIds.push(user.pk);
    });

    const dividedStory = lodash.chunk(userIds, 30);

    dividedStory.forEach(async (stories) => {
      const reelsFeed = await ig.feed.reelsMedia({
        userIds: stories,
      });

      const storyItems = await reelsFeed.items();

      ig.story.seen(storyItems).then(async(response) => {

        let logUsernames = [];

        if (response?.status) {
          for (const story of storyItems) {

            logUsernames.push((await ig.user.info(story.user.pk)).username);
            const log = count(logUsernames)

            for (let value in log) {
                console.log("\x1b[32m%s\x1b[0m", value, " =====> STORY SEEN ", " =====> ", log[value]);
              }
          }
        }
        
      });
    });
  } catch (error) {
    console.log(error);
    process.exit();
  }
};
