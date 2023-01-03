import axios from "axios";
import { webApiCookie } from "./cookie.js";

export const fetchingStories = (userIds, state) => {
  return new Promise((resolve, reject) => {
    const cookie = webApiCookie(state);
    let ids;
    ids = userIds.map((user) => `reel_ids=${user.pk}`);
    const array = ids.slice(0, 30);
    ids = array.toString().replace(/,/g, "&");

    const URL = `https://i.instagram.com/api/v1/feed/reels_media/?${ids}`;

    axios
      .get(URL, {
        headers: {
          accept: "*/*",
          "accept-encoding": "gzip, deflate, br",
          "accept-language": "en-GB,en-US;q=0.9,en;q=0.8,mt;q=0.7",
          "sec-ch-ua":
            '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
          "sec-ch-ua-mobile": "?0",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "x-asbd-id": "198387",
          "x-ig-app-id": "936619743392459",
          "x-ig-www-claim":
            "hmac.AR2wPaGNvFPYMC0nhhS96yXwscHchlkLjCBqjOTBJ8kEPm6h",
          "x-requested-with": "XMLHttpRequest",
          "User-Agent":
            "Instagram 223.1.0.14.103 Android (31/12; 440dpi; 2048x2048; Xiaomi/Redmi; Redmi Note 9 Pro Max; excalibur; qcom; en_IN; 352895580)",
          cookie,
        },
        referrer: "https://www.instagram.com/",
        referrerPolicy: "strict-origin-when-cross-origin",
        body: null,
        method: "GET",
        mode: "cors",
      })
      .then((stories) => {
        console.log(stories.data, "stories");
        resolve(stories.data);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
};
