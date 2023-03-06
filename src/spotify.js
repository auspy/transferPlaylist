import queryString from "query-string";
import { __dirname } from "../path.js";
import fetch from "node-fetch";
import { toFetch } from "../helper/basic.js";

// URLS
const redirect_uri = "http://localhost:3000/spotify";
const spotifyPlaylists = "https://api.spotify.com/v1/me/playlists";
const urlSpotifySearch = "https://api.spotify.com/v1/search?";
const urlToken = "https://accounts.spotify.com/api/token";
const urlSpotifyCreatePlaylist = (user_id) =>
  `https://api.spotify.com/v1/users/${user_id}/playlists`;
const urlSpotifyAddToPlaylist = (playlist_id) =>
  `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`;
const urlCurrentUser = "https://api.spotify.com/v1/me";

const spotifyLogin = (req, res) => {
  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const state = "123456789123456";
  const scope =
    "user-read-private user-read-email playlist-modify-public playlist-modify-private";
  const data = req.body;
  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      queryString.stringify({
        response_type: "code",
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: JSON.stringify(data) || state,
      })
  );
};

const spotifyGetAccessToken = (req) => {
  return new Promise((resolve, reject) => {
    const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
    console.log(client_secret, "secret");
    const client_id = process.env.SPOTIFY_CLIENT_ID;

    // console.log("spotify callback", req);
    const code = req.query.code || null;
    const state = req.query.state || null;

    if (state === null) {
      // res.redirect(
      //   "/#" +
      //     queryString.stringify({
      //       error: "state_mismatch",
      //     })
      // );
      console.log("state_mismatch");
    } else {
      console.log("here");
      // TO GET ACCRESS TOKENS
      // convert data to url encoded data
      const details = {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: "authorization_code",
      };

      let formBody = [];
      for (const property in details) {
        const encodedKey = encodeURIComponent(property);
        const encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
      }
      formBody = formBody.join("&");
      console.log(formBody, "formBody");
      fetch(urlToken, {
        method: "POST",
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(client_id + ":" + client_secret).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formBody,
      })
        .then((res) => res.json())
        .then((r) => {
          console.log("spotifyGetAccessToken RESPONSE", r);
          const { access_token } = r;
          // res.json(r);

          resolve({ token: access_token, data: state });
        })
        .catch((err) => {
          console.log("ERROR: ", err, ": spotifyGetAccessToken");
          reject("Error");
        });
    }
  });
};

const spotifySearch = (req, res) => {
  return new Promise((resolve, reject) => {
    spotifyGetAccessToken(req).then(
      async ({ token, data }) => {
        const searchFor = data && JSON.parse(data);
        console.log(data, searchFor, "data");
        const found = {};
        for (const search of searchFor) {
          const track = search?.track?.[1] || "lonely";
          // const artist = (search?.track?.[0] || "Akon").replace(/\s/, "%20");
          // const year = search?.year;
          const type = ["track"].toString();
          const searchQuery = queryString.stringify({
            q: `${search?.track?.join(" ")}`,
            type: type,
            market: "ES",
            limit: 5,
            // offset: 5,
          });
          console.log("token", urlSpotifySearch + searchQuery);
          await fetch(urlSpotifySearch + searchQuery, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          })
            .then((res) => res.json())
            .then((value) => {
              // console.log("value", value);
              const items = value.tracks?.items;
              // resolve(items);
              const filtered = spotifyFilterSearch(items, search);
              if (!filtered) {
                console.log("FILTERED NULL FOR", track);
              }
              found[track] = filtered || items;
            });
        }
        const uris = Object.values(found).filter(
          (item) =>
            item && typeof item == "string" && item.split("spotify:track:")
        );
        spotifyAddToPlaylistProcess("current", uris, token);
        res.json(uris);
        // res.send(token)
      },
      (err) => {
        console.log("ERROR: ", err, ": spotifyCallback");
        reject(err);
      }
    );
  });
};

export { spotifySearch as spotify, spotifyLogin as login };

export const test = (req, res) => {
  console.log("router test complete");
  res.sendFile(__dirname + "/src/index/index.html");
};

const spotifyFilterSearch = (foundItems, search) => {
  let found = null;
  let maxPopularity = 0;
  if (!(foundItems && typeof foundItems == "object")) {
    return;
  }
  // Object.keys(foundItems).forEach((id) => {
  //   console.log(id, foundItems[id], foundItems,"iemmmm");
  for (const result of foundItems) {
    if (!result) {
      return;
    }
    // NAME MUST MATCH TRACK
    // since we cant differentiate track and album we will try using both
    for (const item of search.track) {
      // console.log(search, result);
      // console.log(result.name?.toLowerCase(), item?.toLowerCase(), "here");
      if (result.name?.toLowerCase() == item?.toLowerCase()) {
        // if match then check popularity
        if (maxPopularity < result.popularity) {
          maxPopularity = result.popularity;
          found = result.uri;
        }
        break;
      }
    }
  }
  // });
  // console.log(found, "found");
  return found;
};

const spotifyCreatePlaylist = (user_id, token) => {
  return new Promise(async (resolve, reject) => {
    const userid =
      user_id == "current" ? await spotifyGetCurrentUserId(token) : user_id;
    if (!userid) {
      console.log("missing userid");
      resolve(null);
    }
    console.log("-- creating playlist --");
    fetch(urlSpotifyCreatePlaylist(userid), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "New Playlist",
        description: "New playlist description",
        public: false,
      }),
    })
      .then((res) => res.json())
      .then((value) => {
        console.log("value", value);
        const playlistId = value.id;
        console.log("PLATLIST CREATED", playlistId);
        resolve(playlistId);
      })
      .catch((err) => {
        console.log(err, "fetch spotifyCreatePlaylist");
        resolve(null);
      });
  });
};

const spotifyAddItemsToPlaylist = async (playlistId, uris = [], token) => {
  if (!(playlistId && uris?.length > 0 && token)) {
    console.log("missing data spotifyAddItemsToPlaylist");
    return;
  }
  console.log("-- add to playlist start --");
  const res = await toFetch(
    urlSpotifyAddToPlaylist(playlistId),
    {
      uris: uris,
    },
    "POST",
    { Authorization: `Bearer ${token}` }
  );
  if (res) {
    // success
    console.log("Successfully added items to playlist");
    return "ok";
  }
  console.log("Failed to add tracks to playlist");
};

const spotifyAddToPlaylistProcess = async (user_id, uris, token) => {
  const playlistId = await spotifyCreatePlaylist(user_id, token);
  if (!playlistId) {
    console.log("FAILED TO CREATE PLATLIST");
    return;
  }
  await spotifyAddItemsToPlaylist(playlistId, uris, token);
};

const spotifyGetCurrentUserId = async (token) => {
  const data = await toFetch(urlCurrentUser, undefined, "GET", {
    Authorization: `Bearer ${token}`,
  });
  if (data) {
    console.log("USER ID", data.id);
    return data.id;
  }
};
