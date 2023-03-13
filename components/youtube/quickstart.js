import fs from "fs";
import { google } from "googleapis";
import queryString from "query-string";

const OAuth2 = google.auth.OAuth2;

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/youtube-nodejs-quickstart.json
const SCOPES = ["https://www.googleapis.com/auth/youtube.force-ssl"];
// const SCOPES = ["https://www.googleapis.com/auth/youtube.readonly"];
const TOKEN_DIR =
  (process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE) +
  "/.credentials/";
const TOKEN_PATH = TOKEN_DIR + "youtube-nodejs-quickstart.json";
/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
async function authorize(req, res, credentials, callback) {
  return new Promise((resolve, reject) => {
    const clientSecret = credentials.web.client_secret;
    const clientId = credentials.web.client_id;
    const redirectUrl = credentials.web.redirect_uris[0];
    if (!(clientSecret && clientId && redirectUrl)) {
      reject("missing params authorize yt");
    }
    const oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, async function (err, token) {
      try {
        if (err) {
          resolve(await getNewToken(req, res, oauth2Client, callback));
        } else {
          oauth2Client.credentials = JSON.parse(token);
          const callBack = await callback(oauth2Client);
          // console.log("sad", callBack);
          resolve(callBack);
        }
      } catch (error) {
        reject(error);
      }
    });
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
async function getNewToken(req, res, oauth2Client, callback) {
  return new Promise((resolve, reject) => {
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES,
    });
    // send user to the link
    res.redirect(authUrl);
  });
}

export async function youtubeCallback(req, res) {
  return new Promise((resolve, reject) => {
    fs.readFile(
      "/Users/spark/Desktop/reactApps/transferPlaylist/keys/client_secret.json",
      async function processClientSecrets(err, content) {
        try {
          if (err) {
            let e = "Error loading client secret file: " + err;
            console.log(e);
            reject(e);
          }
          const credentials = JSON.parse(content);
          const clientSecret = credentials.web.client_secret;
          const clientId = credentials.web.client_id;
          const redirectUrl = credentials.web.redirect_uris[0];
          if (!(clientSecret && clientId && redirectUrl)) {
            reject("missing params authorize yt");
          }
          const oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);
          // read code from that url can send it here
          const code = req.query?.code;
          oauth2Client.getToken(code, async function (err, token) {
            if (err) {
              let e = "Error while trying to retrieve access token" + err;
              console.log(e);
              reject(e);
            }
            oauth2Client.credentials = token;
            console.log("token,", token);
            // ! enter token by replacing %2F with /
            storeToken(token);
            res.redirect("/");
          });
        } catch (error) {
          console.log("ytGetAuth", error, "ytGetAuth");
        }
      }
    );
  });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != "EEXIST") {
      throw err;
    }
  }
  if (!token) {
    return;
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
    if (err) throw err;
    console.log("Token stored to " + TOKEN_PATH);
  });
}

// Load client secrets from a local file.
const ytGetAuth = async (req, res) => {
  return new Promise((resolve, reject) => {
    fs.readFile(
      "/Users/spark/Desktop/reactApps/transferPlaylist/keys/client_secret.json",
      async function processClientSecrets(err, content) {
        try {
          if (err) {
            let e = "Error loading client secret file: " + err;
            console.log(e);
            reject(e);
          }
          console.log("content", JSON.parse(content));
          // Authorize a client with the loaded credentials, then call the YouTube API.
          await authorize(req, res, JSON.parse(content), (auth) =>
            resolve(auth)
          );
          // console.log("a", items);
        } catch (error) {
          res.redirect(
            "/?" +
              queryString({
                err: error,
              })
          );
          console.log("ytGetAuth", error, "ytGetAuth");
        }
      }
    );
  });
};

export default ytGetAuth;

export function removeYtAccount(req, res) {
  return fs.unlink(TOKEN_PATH, (err) => {
    if (err) {
      console.log(err);
      res.send({ status: "failed" });
      return;
    } else {
      console.log("removed yt account file");
      res.send({ status: "ok" });
      return;
    }
  });
}
