import queryString from "query-string";
import { urlSpRedirectGet } from "../../paths.js";
import { spotifyLogin } from "../../src/spotify.js";
import ytAddPlaylistItems from "../youtube/addPlaylistItems.js";
import ytCreatePlaylist from "../youtube/createPlaylist.js";
import ytGetAuth from "../youtube/quickstart.js";
import ytSearch from "../youtube/ytSearch.js";
import spGetPlaylistItems from "./spGetPlaylistItems.js";

export const spotifyToYtAuth = (req, res) => {
  const playlistId = req.params?.playlistId;
  if (!playlistId) {
    return "missing params spGetPlaylistItems";
  }
  spotifyLogin({ req, body: { playlistId } }, res, urlSpRedirectGet);
};

export const spotifyToYtQuery = (req, res) => {
  const playlistId = req.query.playlistId;
  console.log("id =>", playlistId);
  if (playlistId) {
    res.redirect(`/spotifyToYt/${playlistId}`);
  } else {
    res.redirect("/");
  }
};

export const spotifyToYt = async (req, res) => {
  const endFunction = (reason) => {
    console.log(reason);
    // res.json(reason);

    res.redirect("/?reason=" + reason);
    return reason;
  };
  console.log("--- starting transfer from spotify to yt ---");
  try {
    // GET YT AND SPOTIFY AUTH
    const items = await spGetPlaylistItems(req);
    const auth = await ytGetAuth(req, res);
    const searchFor = [];
    if (!items) {
      const err = "missing data spotifyToYt";
      return endFunction(err);
    }
    if (!(auth && auth.credentials)) {
      const err = "missing yt auth spotifyToYt";
      return endFunction(err);
    }
    // console.log("spotify playlist items", items);
    if (!(items && Array.isArray(items))) {
      const err = "missing spotify playlist items";
      return endFunction(err);
    }
    for (const item of items) {
      const track = item && item.track;
      const artists = [];
      if (track) {
        // get artist names
        track.artists &&
          track.artists.forEach((artist) => {
            if (artist) {
              artists.push(artist.name);
            }
          });
        // { title: track.name, artist: artists }
        searchFor.push(track.name + " " + artists.join(" "));
      }
    }
    console.log("searchFor", searchFor);
    // CREATE PLAYLIST
    const playlistId = await ytCreatePlaylist(auth, "New TransferPlaylist");
    if (!playlistId) {
      const err = "failed to create playlist";
      return endFunction(err);
    }
    // SEARCH FOR SONGS
    const results = [];
    const status = [];
    for (const search of searchFor) {
      if (search) {
        results.push(await ytSearch(auth, search, req, res));
      }
    }
    for (const index in results) {
      const result = results[index];
      if (!result) {
        console.log("missing result for", searchFor[index]);
        continue;
      }
      const added = await ytAddPlaylistItems(
        auth,
        playlistId,
        result.id.videoId,
        result.id.kind
      );
      status.push(added || index);
    }
    // TRY AGAIN FOR MISSED ITEMS
    const failed = status.filter((item) => item && typeof item == "string");
    const failedQuery = [];
    console.log("FAILED ", failed);
    if (failed.length > 0) {
      for (const index of failed) {
        // trying only missed values
        const added = await ytAddPlaylistItems(
          auth,
          playlistId,
          results[index].id.videoId,
          results[index].id.kind
        );
        console.log("new try for", index, "=>", added);
        if (typeof added == "string" || typeof added == "number") {
          failedQuery.push(searchFor[index]);
        }
        status[index] = added;
      }
    }
    const query = queryString.stringify({
      failed: failedQuery,
      playlistId,
      type: "youtube",
    });
    res.redirect("/results?" + query);

    // // ADD ITEMS TO PLAYLIST
  } catch (error) {
    return endFunction(error);
  }
};
