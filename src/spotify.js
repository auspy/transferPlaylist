import queryString from "query-string";
import {
  urlCurrentUser,
  urlSpPlaylistTracks,
  urlSpCreatePlaylist,
  urlSpotifySearch,
  urlSpRedirect,
  urlSpToken,
  __dirname,
} from "../paths.js";
import fetch from "node-fetch";
import { toFetch } from "../helper/basic.js";

const spotifyLogin = (req, res, redirect_uri = urlSpRedirect) => {
  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const state = "123456789123456";
  const scope =
    "user-read-private user-read-email playlist-modify-public playlist-modify-private";
  const data = req.body;
  // console.log("redirect_uri", redirect_uri);
  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      queryString.stringify({
        response_type: "code",
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: JSON.stringify(data ? data : state),
      })
  );
};

export const spotifyGetAccessToken = (req,redirectUrl = urlSpRedirect) => {
  return new Promise((resolve, reject) => {
    const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
    // console.log(client_secret, "secret");
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
      // TO GET ACCRESS TOKENS
      // convert data to url encoded data
      const details = {
        code: code,
        redirect_uri: redirectUrl,
        grant_type: "authorization_code",
      };

      let formBody = [];
      for (const property in details) {
        const encodedKey = encodeURIComponent(property);
        const encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
      }
      formBody = formBody.join("&");
      // console.log(formBody, "formBody");
      fetch(urlSpToken, {
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
          // console.log("spotifyGetAccessToken RESPONSE", r);
          const { access_token } = r;
          // res.json(r);
          if (!access_token) {
            console.log("access_token", access_token, r);
            reject(r);
          }
          resolve({ token: access_token, data: JSON.parse(state) });
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
        const searchFor = data;
        console.log(searchFor, "data");
        const found = {};
        const failed = [];
        for (const search of searchFor) {
          const track = search?.track?.[1] || "lonely";
          const query = search?.track?.join(" ");
          // const artist = (search?.track?.[0] || "Akon").replace(/\s/, "%20");
          // const year = search?.year;
          const type = ["track"].toString();
          const searchQuery = queryString.stringify({
            q: `${query}`,
            type: type,
            market: "ES",
            limit: 5,
            // offset: 5,
          });
          console.log("token -", query, "=>", urlSpotifySearch + searchQuery);
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
              if (filtered.includes("_alt")) {
                console.log("FILTERED NULL FOR", track);
                failed.push(query);
              }
              found[track] = filtered?.replace("_alt", "");
            });
        }
        const uris = Object.values(found).filter(
          (item) =>
            item && typeof item == "string" && item.split("spotify:track:")
        );
        spotifyNewPlaylistSetup("current", uris, token);
        res.json({ found: uris, failed });
        // res.send(token)
      },
      (err) => {
        console.log("ERROR: ", err, ": spotifyCallback");
        reject(err);
      }
    );
  });
};

export { spotifySearch as spotify, spotifyLogin };

export const test = (req, res) => {
  console.log("router test complete");
  res.sendFile(__dirname + "/public/index.html");
};

const spotifyFilterSearch = (foundItems, search) => {
  let found = null;
  let maxPopularity = 0;
  if (!(foundItems && typeof foundItems == "object")) {
    return;
  }
  let ifFoundNothing = foundItems[0]?.uri;
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
      const name = result?.name?.split("(From")?.[0].trim().toLowerCase();
      // to remove words like (From tu jhooti me makaar) as it will not be able to match any name from search array
      if (name == item?.toLowerCase()) {
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
  return found || ifFoundNothing + "_alt";
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
    fetch(urlSpCreatePlaylist(userid), {
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
        // console.log("value", value);
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
  // to add only 100 uris per request
  for (let index = 0; index < uris.length; index += 100) {
    const res = await toFetch(
      urlSpPlaylistTracks(playlistId),
      {
        uris: uris.slice(index, index + 100),
      },
      "POST",
      token
    );
    if (res) {
      // success
      console.log("Successfully added items to playlist");
    } else {
      console.log("Failed to add tracks to playlist", index);
    }
  }
};

const spotifyNewPlaylistSetup = async (user_id, uris, token) => {
  const playlistId = await spotifyCreatePlaylist(user_id, token);
  if (!playlistId) {
    console.log("FAILED TO CREATE PLATLIST");
    return;
  }
  await spotifyAddItemsToPlaylist(playlistId, uris, token);
};

const spotifyGetCurrentUserId = async (token) => {
  const data = await toFetch(urlCurrentUser, undefined, "GET", token);
  if (data) {
    console.log("USER ID", data.id);
    return data.id;
  }
};
