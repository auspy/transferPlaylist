import ytGetAuth from "./quickstart.js";
import { youtube } from "./ytImports.js";

// todo we can get more results and then filter correct result if needed
// for now i think yt search works great

const ytSearch = (auth, searchFor) => {
  return new Promise(async (resolve, reject) => {
    if (!auth) {
      auth = await ytGetAuth();
    }
    youtube.search
      .list({
        auth,
        part: ["snippet"],
        maxResults: 1,
        q: searchFor,
      })
      .then((res) => {
        console.log(res);
        resolve(res.data.items[0]);
      })
      .catch((err) => {
        console.log(err, "in ytSearch");
        reject(err);
      });
  });
};

/**
 * max results = 5
 * type = video
 * part = snippet
 * order = viewCount
 * q = "string to search"
 */

export default ytSearch;
