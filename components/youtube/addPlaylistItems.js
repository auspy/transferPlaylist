import { youtube } from "./ytImports.js";

export default async function ytAddPlaylistItems(
  auth,
  playlistId,
  videoId,
  videoKind = "youtube#playlistItem",
  part = [],
  snippetBody = {},
  body = {}
) {
  if (!(auth && videoId && videoKind && playlistId)) {
    console.log("missing params ytAddPlaylistItems");
    return
  }
  return await youtube.playlistItems
    .insert({
      auth,
      part: ["snippet", ...part],
      requestBody: {
        ...body,
        snippet: {
          ...snippetBody,
          playlistId,
          resourceId: {
            kind: videoKind,
            videoId,
          },
        },
      },
    })
    .then(
      function (response) {
        // Handle the results here (response.result has the parsed body).
        if (response) {
          const playlistId = response.data.snippet.resourceId;
          console.log("playlistId", playlistId);
          return playlistId;
        }
      },
      function (err) {
        console.error("Execute error", err);
        return
      }
    )
    .catch((err) => {
      console.log(err, "in ytCreatePlaylist");
      return
    });
}
