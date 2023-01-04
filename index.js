import {
  IgApiClient,
  IgCheckpointError,
  IgLoginRequiredError,
  IgUserHasLoggedOutError,
} from "instagram-private-api";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import moment from "moment";
import path from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";
import "dotenv/config";

const username = process.env.IG_USERNAME;
const password = process.env.IG_PASSWORD;
const sleep = process.env.SLEEP;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let tokenPath = `${__dirname}/token/${username}.json`;
let tokenDirectory = `${__dirname}/token`;

if (!existsSync(tokenDirectory)) {
  mkdirSync(tokenDirectory);
}

(async () => {
  const ig = new IgApiClient();
  ig.state.generateDevice(username);

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
  } else {
    console.log(chalk.yellowBright("Token exist."));

    let token = readFileSync(tokenPath, { encoding: "utf-8" });
    await ig.state.deserialize(token);
    console.log(chalk.green("successfully logged in."));

    const serialized = await ig.state.serialize();
    delete serialized.constants;
    writeFileSync(tokenPath, JSON.stringify(serialized));
  }

  while (true) {
    let medias = await ig.feed
      .timeline()
      .items()
      .catch((error) => {
        console.log(chalk.red(error.message));

        if (
          error instanceof IgLoginRequiredError ||
          error instanceof IgUserHasLoggedOutError ||
          error instanceof IgCheckpointError
        ) {
          unlinkSync(tokenPath);
          console.log(chalk.red("account relogin required."));
          process.exit();
        }
      });

    if (medias?.length) {
      for (const media of medias) {
        if (!media.has_liked) {
          let { status } = await ig.media
            .like({
              mediaId: media.id,
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
                unlinkSync(tokenPath);
                console.log(chalk.red("account relogin required."));
                process.exit();
              }
            });

          if (status) {
            console.log(
              chalk.green(
                `Post liked successfully ===> ${media.user.username} `
              )
            );
          }
        }
      }

      console.log(
        chalk.magenta(
          `next run ${moment(
            new Date().getTime() + parseInt(sleep) * 1000
          ).fromNow()}`
        )
      );
      await new Promise((r) => setTimeout(r, parseInt(sleep) * 1000));
    }
  }
})();
