import { google } from "googleapis";

const service = google.youtube("v3");

export default async function ytGetPlaylistItems(
  auth,
  options = {
    part: [],
    playlistId: "",
  }
) {
  if (!(options.playlistId && options.part && options.part.length)) {
    return;
  }
  return await service.playlistItems
    .list({
      part: options.part,
      playlistId: options.playlistId,
      auth,
      ...options,
    })
    .then(
      function (response) {
        // Handle the results here (response.result has the parsed body).
        //   console.log("Response", response);
        const data = response.data;
        const items = data.items;
        // console.log(items);
        return items;
      },
      function (err) {
        console.error("Execute error", err);
        return;
      }
    );
}
