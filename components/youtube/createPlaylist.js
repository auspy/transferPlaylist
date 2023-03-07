import { youtube } from "./ytImports.js";

export default function ytCreatePlaylist(
  auth,
  playlistTitle = "New Playlist",
  part = [],
  body = {}
) {
  return new Promise(async (resolve, reject) => {
    if (!playlistTitle) {
      reject("missing playlistTitle ytCreatePlaylist");
    }
    if (!auth) {
      reject("missing auth ytCreatePlaylist");
    }
    return await youtube.playlists
      .insert({
        auth,
        part: ["snippet", ...part],
        requestBody: {
          snippet: {
            title: playlistTitle,
          },
          ...body,
        },
      })
      .then(
        function (response) {
          // Handle the results here (response.result has the parsed body).
          // console.log("playost", response);
          if (response) {
            const playlistId = response.data.id;
            console.log("playlistId", playlistId);
            resolve(playlistId);
          } else {
            reject(response);
          }
        },
        function (err) {
          console.log(err, "playost");
          console.error("Execute error ytCreatePlaylist", err.errors);
          reject(err?.errors || err);
        }
      )
      .catch((err) => {
        console.log(err, "in ytCreatePlaylist");
        reject(err);
      });
  });
}
