import { toFetch } from "../../helper/basic.js";
import { urlSpPlaylistTracks, urlSpRedirectGet } from "../../paths.js";
import { spotifyGetAccessToken } from "../../src/spotify.js";

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
        //   TODO get in batches
        resolve(
          await toFetch(urlSpPlaylistTracks(playlistId), null, "GET", token)
        );
      },
      (err) => {
        console.log(err, "spGetPlaylistItems");
        reject(err);
      }
    );
  });
};

export default spGetPlaylistItems;
