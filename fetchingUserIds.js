import axios from "axios";
import { webApiCookie } from "./cookie.js";

const URL =
  "https://www.instagram.com/api/v1/media/2984341574386541086/likers/";

export const fetchingUserIds = (state) => {
  return new Promise((resolve, reject) => {
    const cookie = webApiCookie(state);
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
          "user-agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
          cookie : process.env.COOKIE,
        },
        method: "GET",
        body: null,
        mode: "cors",
        referrer: "https://www.instagram.com/",
        referrerPolicy: "strict-origin-when-cross-origin",
      })
      .then((res) => {console.log(res); })
      .catch((err) => console.log(err));
  });
};
