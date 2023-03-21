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
  // console.log(data, "fata");
  // console.log("redirect_uri", redirect_uri);
  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      queryString.stringify({
        response_type: "code",
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: JSON.stringify(data ? data : state),
        show_dialog: true,
      })
  );
};

export const spotifyGetAccessToken = (req, redirectUrl = urlSpRedirect) => {
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
          // console.log("state =>", state);
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
          if (!search) {
            continue;
          }
          const filterSearch = search.track?.map(
            (item) => item && item.replace(/\+/g, " ")
          );
          console.log(filterSearch, "filterSearch");
          const track = filterSearch?.[1] || "lonely";
          const query = filterSearch?.join(" ");
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
              if (
                (filtered &&
                  filtered.includes("_alt") &&
                  filtered.length < 5) ||
                !filtered
              ) {
                console.log("FILTERED NULL FOR", track);
                failed.push(query);
              }
              found[track] = filtered && filtered.replace("_alt", "");
            });
        }
        const uris = Object.values(found).filter(
          (item) =>
            item && typeof item == "string" && item.split("spotify:track:")
        );
        const playlistId = await spotifyNewPlaylistSetup(
          "current",
          uris,
          token
        );
        // res.json({ found: uris, failed });
        // res.render("pages/results", {
        //   results: JSON.stringify({
        //     // found: uris,
        //     failed,
        //     playlistId,
        //     type: "spotify",
        //   }),
        // });
        const query = queryString.stringify({
          // found: uris,
          failed,
          playlistId,
          type: "spotify",
        });
        res.redirect("/results?" + query);
      },
      (err) => {
        console.log("ERROR: ", err, ": spotifyCallback");
        const query = queryString.stringify({
          err,
        });
        res.redirect("/?" + query);
      }
    );
  });
};

export { spotifySearch as spotify, spotifyLogin };

export const test = (req, res) => {
  console.log("router test complete");
  // to test results page with data
  // res.render("pages/results", { results: `{"found":[{"kind":"youtube#searchResult","etag":"LPk1XxavJ2lar4M-h7Kdcc8_IgY","id":{"kind":"youtube#video","videoId":"EbyAoYaUcVo"},"snippet":{"publishedAt":"2022-12-15T05:30:10Z","channelId":"UCtpDorOuxwQ1URGQ0WLIXmQ","title":"WOH (Official Video) - Ikka x Dino James x Badshah | Def Jam India","description":"India's Hip-Hop superstars Ikka, Dino James & Badshah come together to channel their inner hopeless romanticism on 'Woh.","thumbnails":{"default":{"url":"https://i.ytimg.com/vi/EbyAoYaUcVo/default.jpg","width":120,"height":90},"medium":{"url":"https://i.ytimg.com/vi/EbyAoYaUcVo/mqdefault.jpg","width":320,"height":180},"high":{"url":"https://i.ytimg.com/vi/EbyAoYaUcVo/hqdefault.jpg","width":480,"height":360}},"channelTitle":"Dino James","liveBroadcastContent":"none","publishTime":"2022-12-15T05:30:10Z"}},{"kind":"youtube#searchResult","etag":"VjGusd-rXF1zZ9M48G-aysq9EnM","id":{"kind":"youtube#video","videoId":"S9bCLPwzSC0"},"snippet":{"publishedAt":"2009-12-25T04:20:46Z","channelId":"UC20vb-R_px4CguHzzBPhoyQ","title":"Eminem - Mockingbird [Official Music Video]","description":"Eminem - Mockingbird Listen: https://eminem.lnk.to/mockingbird Spotify: https://eminem.lnk.to/mockingbird/spotify Apple Music: ...","thumbnails":{"default":{"url":"https://i.ytimg.com/vi/S9bCLPwzSC0/default.jpg","width":120,"height":90},"medium":{"url":"https://i.ytimg.com/vi/S9bCLPwzSC0/mqdefault.jpg","width":320,"height":180},"high":{"url":"https://i.ytimg.com/vi/S9bCLPwzSC0/hqdefault.jpg","width":480,"height":360}},"channelTitle":"EminemVEVO","liveBroadcastContent":"none","publishTime":"2009-12-25T04:20:46Z"}},{"kind":"youtube#searchResult","etag":"7Wx-fylkyIH4JDqFOAZglBoOO0k","id":{"kind":"youtube#video","videoId":"Cxg6xPmSFFU"},"snippet":{"publishedAt":"2020-11-18T06:30:11Z","channelId":"UC7_zJCOlMgGD80Iv656xCjg","title":"Zaeden - socha na tha (Official Music Video)","description":"Subscribe to Zaeden's Channel: https://bit.ly/ZaedenYouTube Stream: https://atozae.lnk.to/snt 'socha na tha' is Zaeden's fourth ...","thumbnails":{"default":{"url":"https://i.ytimg.com/vi/Cxg6xPmSFFU/default.jpg","width":120,"height":90},"medium":{"url":"https://i.ytimg.com/vi/Cxg6xPmSFFU/mqdefault.jpg","width":320,"height":180},"high":{"url":"https://i.ytimg.com/vi/Cxg6xPmSFFU/hqdefault.jpg","width":480,"height":360}},"channelTitle":"Zaeden","liveBroadcastContent":"none","publishTime":"2020-11-18T06:30:11Z"}},{"kind":"youtube#searchResult","etag":"qrN_odJBGpoFQ4s98P51IxWDcc4","id":{"kind":"youtube#video","videoId":"tsmPCi7NKrg"},"snippet":{"publishedAt":"2023-02-16T17:00:07Z","channelId":"UCI3H1FsjbdqGcLq93ZilV5g","title":"NF - HOPE","description":"Official music video for “HOPE” by NF. New Album HOPE available April 7th. Subscribe to NFrealmusic on YouTube: ...","thumbnails":{"default":{"url":"https://i.ytimg.com/vi/tsmPCi7NKrg/default.jpg","width":120,"height":90},"medium":{"url":"https://i.ytimg.com/vi/tsmPCi7NKrg/mqdefault.jpg","width":320,"height":180},"high":{"url":"https://i.ytimg.com/vi/tsmPCi7NKrg/hqdefault.jpg","width":480,"height":360}},"channelTitle":"NFVEVO","liveBroadcastContent":"none","publishTime":"2023-02-16T17:00:07Z"}},{"kind":"youtube#searchResult","etag":"DndKQopN6pw7iORGxHcYrwxP8zc","id":{"kind":"youtube#video","videoId":"T8nbNQpRwNo"},"snippet":{"publishedAt":"2023-02-24T18:00:21Z","channelId":"UCQznUf1SjfDqx65hX3zRDiA","title":"Drake, 21 Savage - Spin Bout U (Official Music Video)","description":"director - dave meyers ep/producer - nathan scherrer prod company - freenjoy director rep - lark creative cinematographer - scott ...","thumbnails":{"default":{"url":"https://i.ytimg.com/vi/T8nbNQpRwNo/default.jpg","width":120,"height":90},"medium":{"url":"https://i.ytimg.com/vi/T8nbNQpRwNo/mqdefault.jpg","width":320,"height":180},"high":{"url":"https://i.ytimg.com/vi/T8nbNQpRwNo/hqdefault.jpg","width":480,"height":360}},"channelTitle":"DrakeVEVO","liveBroadcastContent":"none","publishTime":"2023-02-24T18:00:21Z"}},{"kind":"youtube#searchResult","etag":"y56kxhaxKpmrxCHStjnHNi8TKns","id":{"kind":"youtube#video","videoId":"QqyuVF1u7_Y"},"snippet":{"publishedAt":"2023-02-22T05:41:19Z","channelId":"UCMXMp3Lc6v6v8dJH5ZGwtqA","title":"RAFTAAR x PRABH DEEP - TRAP PRAA (Explicit Warning) | PRAA | Official Video","description":"Listen to PRAA EP on all audio stores:- Spotify: https://raftaar.bfan.link/praa/spotify Apple: https://raftaar.bfan.link/praa/appleMusic ...","thumbnails":{"default":{"url":"https://i.ytimg.com/vi/QqyuVF1u7_Y/default.jpg","width":120,"height":90},"medium":{"url":"https://i.ytimg.com/vi/QqyuVF1u7_Y/mqdefault.jpg","width":320,"height":180},"high":{"url":"https://i.ytimg.com/vi/QqyuVF1u7_Y/hqdefault.jpg","width":480,"height":360}},"channelTitle":"Raftaar","liveBroadcastContent":"none","publishTime":"2023-02-22T05:41:19Z"}},{"kind":"youtube#searchResult","etag":"fmSArXLLz5bB2yWVyUg0sr62Lvs","id":{"kind":"youtube#video","videoId":"oRZ0cfZ9SeU"},"snippet":{"publishedAt":"2018-02-07T13:41:42Z","channelId":"UCGpd2UgWSQyMqR-odhXygNA","title":"Vilen - Ek Raat (Official Video)","description":"A philosophical art piece and a journey of depression, altered by some series of events! Music available on! Saavn: ...","thumbnails":{"default":{"url":"https://i.ytimg.com/vi/oRZ0cfZ9SeU/default.jpg","width":120,"height":90},"medium":{"url":"https://i.ytimg.com/vi/oRZ0cfZ9SeU/mqdefault.jpg","width":320,"height":180},"high":{"url":"https://i.ytimg.com/vi/oRZ0cfZ9SeU/hqdefault.jpg","width":480,"height":360}},"channelTitle":"Darks Music Company","liveBroadcastContent":"none","publishTime":"2018-02-07T13:41:42Z"}},{"kind":"youtube#searchResult","etag":"k21Gky1rTRZ8QlC1Z0aeFLEuTM8","id":{"kind":"youtube#video","videoId":"AdE1Tkl66N0"},"snippet":{"publishedAt":"2023-03-04T10:57:13Z","channelId":"UCq-Fj5jknLsUf-MWSy4_brA","title":"O Bedardeya (Song) Tu Jhoothi Main Makkaar | Ranbir, Shraddha | Pritam | Arijit Singh | Amitabh B","description":"RanbirKapoor #ShraddhaKapoor #LuvRanjan Experience the gush of emotions with O Bedardya song from the movie Tu Jhoothi ...","thumbnails":{"default":{"url":"https://i.ytimg.com/vi/AdE1Tkl66N0/default.jpg","width":120,"height":90},"medium":{"url":"https://i.ytimg.com/vi/AdE1Tkl66N0/mqdefault.jpg","width":320,"height":180},"high":{"url":"https://i.ytimg.com/vi/AdE1Tkl66N0/hqdefault.jpg","width":480,"height":360}},"channelTitle":"T-Series","liveBroadcastContent":"none","publishTime":"2023-03-04T10:57:13Z"}},{"kind":"youtube#searchResult","etag":"YWL5IbMWmTIet8mw0UgfJ7LNDy0","id":{"kind":"youtube#video","videoId":"dj-si81J4c0"},"snippet":{"publishedAt":"2023-03-07T10:26:09Z","channelId":"UCGpd2UgWSQyMqR-odhXygNA","title":"Vilen - Kyun Dhunde (Official 1Min Music Video)","description":"Official Vertical Video of the one that you already love. Full Music Video releasing soon! if you ever feel lonely, just move out, ...","thumbnails":{"default":{"url":"https://i.ytimg.com/vi/dj-si81J4c0/default.jpg","width":120,"height":90},"medium":{"url":"https://i.ytimg.com/vi/dj-si81J4c0/mqdefault.jpg","width":320,"height":180},"high":{"url":"https://i.ytimg.com/vi/dj-si81J4c0/hqdefault.jpg","width":480,"height":360}},"channelTitle":"Darks Music Company","liveBroadcastContent":"none","publishTime":"2023-03-07T10:26:09Z"}}],"failed":[],"status":[{"kind":"youtube#video","videoId":"EbyAoYaUcVo"},"1",{"kind":"youtube#video","videoId":"Cxg6xPmSFFU"},"3",{"kind":"youtube#video","videoId":"T8nbNQpRwNo"},{"kind":"youtube#video","videoId":"QqyuVF1u7_Y"},{"kind":"youtube#video","videoId":"oRZ0cfZ9SeU"},"7",{"kind":"youtube#video","videoId":"dj-si81J4c0"}],"playlistId":"PLFmYDZOVM51eSJ5HCcA6eq1EQF1g2-FPb","type":"youtube"}` });
  res.render("pages/index", { test: "data is here" });
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
        name: "New TransferPlaylist",
        description: "Thanks for using TRANSFER PLAYLIST",
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
  return playlistId;
};

const spotifyGetCurrentUserId = async (token) => {
  const data = await toFetch(urlCurrentUser, undefined, "GET", token);
  if (data) {
    console.log("USER ID", data.id);
    return data.id;
  }
};
