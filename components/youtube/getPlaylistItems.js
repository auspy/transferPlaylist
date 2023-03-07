import { youtube } from "./ytImports.js";

export default async function ytGetPlaylistItems(
  auth,
  options = {
    part: [],
    playlistId: "",
  }
) {
  const items = [];
  if (!(options.playlistId && options.part && options.part.length)) {
    return;
  }
  await youtube.playlistItems
    .list({
      auth,
      ...options,
    })
    .then(
      async function (response) {
        // Handle the results here (response.result has the parsed body).
        const nextPageToken = response.data.nextPageToken;
        // console.log("Response", response);
        const data = response.data;
        const item = data.items;
        items.push(...item);
        if (nextPageToken) {
          const nextPageItems = await ytGetPlaylistItems(auth, {
            part: options.part,
            playlistId: options.playlistId,
            pageToken: nextPageToken,
          });
          if (nextPageItems) {
            items.push(...nextPageItems);
          }
        }

        // console.log(items);
      },
      function (err) {
        console.error("Execute error", err);
      }
    );
  return items;
}
