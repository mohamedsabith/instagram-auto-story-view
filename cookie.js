import { IgApiClient } from "instagram-private-api";

export const webApiCookie = (state) => {
  if (!state)
    return reject({ status: false, error: "State not allowed to be empty." });

  try {
   
    let cookie = `mid=${state.extractCookieValue(
      "mid"
    )}; ig_did=${state.uuid.toUpperCase()}; ig_nrcb=1;  ds_user_id=${state.extractCookieValue(
      "ds_user_id"
    )}; dpr=1.25; datr=iN-vY7RSNQET7z362H1mTkty; shbid="18796";shbts="1625668337; csrftoken=${
      state.cookieCsrfToken
    };  sessionid=${state.extractCookieValue(
      "sessionid"
    )};  rur=${process.env.RUR}`;
    return cookie;
  } catch (error) {
    throw new Error(error);
  }
};
