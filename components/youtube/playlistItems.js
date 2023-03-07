import { google } from "googleapis";

const service = google.youtube("v3");

export default async function ytGetPlaylistItems(
  auth,
  options = {
    part: [],
    playlistId: "",
  },
  items = []
) {
  if (!(options.playlistId && options.part && options.part.length)) {
    return;
  }
  await service.playlistItems
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
          await ytGetPlaylistItems(
            auth,
            {
              part: options.part,
              playlistId: options.playlistId,
              pageToken: nextPageToken,
            },
            items
          );
        }

        // console.log(items);
      },
      function (err) {
        console.error("Execute error", err);
      }
    );
  return items;
}
