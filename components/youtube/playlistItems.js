import { google } from "googleapis";

const service = google.youtube("v3");

export default function getPlaylistItems(
  auth,
  options = {
    part: ["contentDetails"],
    playlistId: "PLFmYDZOVM51cWWlvGUNQw9pUgI3SRFGe3",
  }
) {
  service.playlistItems
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
        console.log(items);
      },
      function (err) {
        console.error("Execute error", err);
      }
    );
}
