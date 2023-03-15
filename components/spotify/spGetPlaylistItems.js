import { toFetch } from "../../helper/basic.js";
import { urlSpPlaylistTracks, urlSpRedirectGet } from "../../paths.js";
import { spotifyGetAccessToken } from "../spotify.js";

const spGetPlaylistItems = (req) => {
  return new Promise((resolve, reject) => {
    spotifyGetAccessToken(req, urlSpRedirectGet).then(
      async ({ data, token }) => {
        const playlistId = data?.playlistId;
        if (!(playlistId && token)) {
          reject(
            `"missing params spGetPlaylistItems
          \nplaylistId
          ${playlistId}
          \ntoken
          ${token}`
          );
        }
        const items = [];
        //  get in batches of 50. so keep limit at 50
        const getItems = async (url) => await toFetch(url, null, "GET", token);
        const playlistItems = await getItems(
          urlSpPlaylistTracks(playlistId) + "?offset=0&limit=50&market=ES"
        ).catch((err) => {
          reject("wow" + err);
        });
        if (!(playlistItems && Array.isArray(playlistItems.items))) {
          reject("no items found spGetPlaylistItems");
        }
        // add first set of items to array
        items.push(...playlistItems.items);
        let nextUrl = playlistItems["next"];
        // get
        while (nextUrl) {
          // if have next url then get items
          console.log("nextUrl", nextUrl);
          const nextData = await getItems(nextUrl).catch((err) => {
            reject("wow2" + err);
          });
          if (nextData && Array.isArray(nextData.items)) {
            items.push(...nextData.items);
          }
          nextUrl = nextData["next"];
        }
        // console.log(items);
        resolve(items);
      },
      (err) => {
        console.log(err, "spGetPlaylistItems");
        reject(err);
      }
    );
  });
};

export default spGetPlaylistItems;
