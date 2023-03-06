import ytGetPlaylistItems from "../components/youtube/playlistItems.js";
import runYoutube from "../components/youtube/quickstart.js";
import { login } from "./spotify.js";

export const ytGetPlaylistItemsOfId = async (req, res) => {
  const playlistId = req.params?.playlistId;
  console.log("req.params", playlistId);
  runYoutube(ytGetPlaylistItems, [
    {
      part: ["snippet", "contentDetails"],
      playlistId: playlistId || "PLFmYDZOVM51clDamYDl75D1aVH6KYtMxL",
    },
  ]).then(
    (items) => {
      //   console.log(items, "items");
      if (items) {
        const found = [];
        const search = [];
        items.map((item) => {
          //   console.log("item => ", item);
          const title = item.snippet?.title;
          console.log("title", title);
          // * SEARCH FOR ARTIST AND SONG NAME
          //     * FROM TITLE
          // split using "-,|" to get track and artist name
          const searchFor = title
            .split(/[|\-\[\]\(\)]/i)
            .map(
              (item) =>
                item &&
                item.replace(/^official.*video$|(\[|\()\s+(\]|\))/i, "").trim()
              // contains 2 regex separated by |
              // to replace words starting from official and ending with video | to replace empty brackets
            )
            .filter((item) => item && item);

          // * GET DATE FROM CONTENT DETAILS
          const year = new Date(
            item.contentDetails?.["videoPublishedAt"]
          ).getFullYear();

          console.log("searchFor", searchFor);
          search.push({ track: searchFor, year });
        });
        console.log("serh", search);
        // * TO START THE SEARCH
        login(
          {
            ...req,
            body: search,
          },
          res
        ); 
      }
    },
    (err) => {
      console.log(err, "in ytGetPlaylistItemsOf");
    }
  );
};

export const ytGetPlaylistItemsOf = (req, res) => {
  const playlistId = req.query.playlistId;
  if (playlistId) {
    res.redirect(`/ytPlayist/${playlistId}`);
  } else {
    res.redirect("/");
  }
};