import queryString from "query-string";
import { __dirname } from "../path.js";

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = "http://localhost:3000/spotify";
const spotifyPlaylists = "https://api.spotify.com/v1/me/playlists";

const login = (req, res) => {
  const state = "123456789123456";
  const scope = "user-read-private user-read-email";
  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      queryString.stringify({
        response_type: "code",
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state,
      })
  );
};

const spotify = (req, res) => {
  const code = req.query.code || null;
  const state = req.query.state || null;

  if (state === null) {
    res.redirect(
      "/#" +
        queryString.stringify({
          error: "state_mismatch",
        })
    );
  } else {
    console.log("here");
    const authOptions = {
      url: "https://accounts.spotify.com/api/token",
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: "authorization_code",
      },
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(client_id + ":" + client_secret).toString("base64"),
      },
      json: true,
    };
    //     req.post(authOptions, function (error, response, body) {
    //       if (!error && response.statusCode === 200) {
    //         const access_token = body.access_token;
    //         res.send({
    //           access_token: access_token,
    //         });
    //       }
    //     });
    //   }
    fetch(spotifyPlaylists, {
      method: "GET",
      headers: {
        Authorization: process.env.SPOTIFY_TOKEN,
      },
    })
      .then((res) => {
        console.log("RESPONSE", res);
      })
      .catch((err) => console.log("ERROR: ", err));
    //   res.send("spotify");
    // fetch("https://accounts.spotify.com/api/token", {
    //   method: "POST",
    //   headers: {
    //     Authorization:
    //       "Basic " +
    //       Buffer.from(client_id + ":" + client_secret).toString("base64"),
    //     "Content-Type": "application/x-www-form-urlencoded",
    //   },
    //   redirect: redirect_uri,
    //   body: `grant_type=${"authorization_code"}&code=${code}`,
    // })
    //   .then((response) => {
    //     console.log("fetch then", response);
    //     if (response.statusCode === 200) {
    //       const access_token = body.access_token;
    //       res.send({
    //         access_token: access_token,
    //       });
    //     }
    //   })
    //   .catch((err) => {
    //     console.log(err, "here");
    //   });
  }
};

export { spotify, login };

export const test = (req, res) => {
  console.log("rotuer test complete");
  res.sendFile(__dirname + "/src/index/index.html");
};
