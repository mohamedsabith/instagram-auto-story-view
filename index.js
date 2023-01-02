import { IgApiClient } from "instagram-private-api";
import fs from "fs";
import chalk from "chalk";
import lodash from "lodash";
import cron from "node-cron";
import * as dotenv from "dotenv";
dotenv.config();

const ig = new IgApiClient();
ig.state.generateDevice(process.env.IG_USERNAME);

(async () => {
  await ig.simulate.preLoginFlow();
  ig.account
    .login(process.env.IG_USERNAME, process.env.IG_PASSWORD)
    .then(() => {
      cron.schedule("* * * * *", () => {
        fetchReel().then((res) => {
          res.items.forEach((e) => {
            ig.story
              .seen(e)
              .then(() => {
                res.userNames.forEach((e) =>
                  console.log(
                    chalk.blue(
                      "\x1b[32m%s\x1b[0m",
                      "USER =====>",
                      e.username,
                      "MEDIA_ID =====> ",
                      e.media_id
                    )
                  )
                );
              })
              .catch((err) => {
                console.log(err);
              });
          });
        });
      });
    })
    .catch((err) => {
      console.log(chalk.red(err.message));
      process.exit(1);
    });
})();

const fetchReel = async () => {
  const idArray = [];
  const userNames = [];
  const data = await ig.feed.reelsTray("pull_to_refresh");

  const reel = await data.items();
  reel.forEach((e) => {
    e.media_ids.forEach((d) => {
      userNames.push({ username: e.user.username, media_id: d });
      idArray.push({
        id: d + "_" + e.id,
        taken_at: e.latest_reel_media,
        user: { pk: e.id },
      });
    });
  });
  var writeStream = fs.createWriteStream(`${process.env.IG_USERNAME}.log`);
  userNames.forEach((username) => {
    writeStream.write(username.media_id + ",");
  });
  var items = lodash.chunk(idArray, 5);
  return { items, userNames };
};
