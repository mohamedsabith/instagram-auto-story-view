import { IgApiClient } from "instagram-private-api";
import chalk from "chalk";
import lodash from 'lodash'

import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

const ig = new IgApiClient();
ig.state.generateDevice(process.env.IG_USERNAME);

(async () => {
  await ig.simulate.preLoginFlow();
  ig.account
    .login(process.env.IG_USERNAME, process.env.IG_PASSWORD)
    .then((res) => {
        fetchFollowers(ig.state, 'mohamedsabithmp').then((followersId) => {
            fetchReel(followersId).then((res) => {
              res.items.forEach(e => {
                ig.story.seen(e).then((response) =>{
                  res.userNames.forEach(e => console.log(chalk.blue("\x1b[32m%s\x1b[0m", "USER =====>", e.username , "MEDIA_ID =====> " , e.media_id )))
               }).catch((err) => {
                  console.log(err);
               })
              })
            })
        })
       
    })
    .catch((err) => {
      console.log(chalk.red(err.message));
      process.exit(1);
    });
})();

const fetchFollowers = async (state, user) => {
  try {
    const pk = []
    ig.state = state;
    const userId = await ig.user.getIdByUsername(user);
    const followersFeed = await ig.feed.accountFollowers(userId);
    const followerItem = await followersFeed.items();
    followerItem.forEach(e => {
        pk.push(e.pk)
    })
    return pk;
  } catch (error) {
    console.log(error);
  }
};

const fetchReel = async (userId) => {
  const idArray = []
  const userNames = []
   const data = await ig.feed.reelsTray();
   const reel = await data.items()
  reel.forEach(e => {
    e.media_ids.forEach(d => {
      userNames.push({username: e.user.username,media_id:d})
      idArray.push({id:d + '_' + e.id ,taken_at: e.latest_reel_media,user: {pk: e.id}})
    })
  })
  var items = lodash.chunk(idArray, 5)
   return {items, userNames};
};
