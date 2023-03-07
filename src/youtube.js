import ytGetPlaylistItems from "../components/youtube/getPlaylistItems.js";
import ytGetAuth from "../components/youtube/quickstart.js";
import { spotifyLogin } from "./spotify.js";

export const ytToSpotify = async (req, res) => {
  const playlistId = req.params?.playlistId;
  console.log("req.params", playlistId);
  const auth = await ytGetAuth();
  if (!auth) {
    return "missing auth";
  }
  ytGetPlaylistItems(auth, {
    part: ["snippet", "contentDetails"],
    playlistId: playlistId || "PLFmYDZOVM51clDamYDl75D1aVH6KYtMxL",
  }).then(
    (items) => {
      //   console.log(items, "items");
      if (items) {
        const search = [];
        items.map((item) => {
          //   console.log("item => ", item);
          const title = item.snippet?.title;
          // console.log("title", title);
          // * SEARCH FOR ARTIST AND SONG NAME
          //     * FROM TITLE
          // split using "-,|" to get track and artist name
          const searchFor = title
            .split(/[|\-\[\]\(\)]/i)
            .filter((item) => item && item.toLowerCase() != "song")
            .map(
              (item) =>
                item &&
                item
                  .replace(
                    /^official.*(video|audio|trailer)$|(\[|\()\s+(\]|\))/i,
                    ""
                  )
                  .trim()
              // contains 2 regex separated by |
              // to replace words starting from official and ending with video or audio or trailer | to replace empty brackets
            )
            .filter((item) => item && item);

          // * GET DATE FROM CONTENT DETAILS
          const year = new Date(
            item.contentDetails?.["videoPublishedAt"]
          ).getFullYear();

          // console.log("searchFor", searchFor);
          search.push({ track: searchFor, year });
        });
        // console.log("serh", search);
        // * TO START THE SEARCH
        spotifyLogin(
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

export const ytToSpotifyQuery = (req, res) => {
  const playlistId = req.query.playlistId;
  if (playlistId) {
    res.redirect(`/ytToSpotify/${playlistId}`);
  } else {
    res.redirect("/");
  }
};
