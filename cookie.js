import { IgApiClient } from "instagram-private-api";

export const webApiCookie = (state) => {
  if (!state)
    return reject({ status: false, error: "State not allowed to be empty." });

  try {
    const ig = new IgApiClient();
    ig.state = state;
    let cookie = `mid=${ig.state.extractCookieValue(
      "mid"
    )}; ig_did=${ig.state.uuid.toUpperCase()}; ig_nrcb=1;  csrftoken=${
      ig.state.cookieCsrfToken
    }; ds_user_id=${ig.state.extractCookieValue(
      "ds_user_id"
    )}; shbid="18796"; sessionid=${ig.state.extractCookieValue(
      "sessionid"
    )}; shbts="1625668337; rur=${ig.state.extractCookieValue("rur")}`;

    return cookie;
  } catch (error) {
    throw new Error(error);
  }
};
