import fs from "fs";
import readline from "readline";
import { google } from "googleapis";

const OAuth2 = google.auth.OAuth2;

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/youtube-nodejs-quickstart.json
const SCOPES = ["https://www.googleapis.com/auth/youtube.readonly"];
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
async function authorize(credentials, callback) {
  return new Promise((resolve) => {
    const clientSecret = credentials.web.client_secret;
    const clientId = credentials.web.client_id;
    const redirectUrl = credentials.web.redirect_uris[0];
    const oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, async function (err, token) {
      if (err) {
        resolve(await getNewToken(oauth2Client, callback));
      } else {
        oauth2Client.credentials = JSON.parse(token);
        const callBack = await callback(oauth2Client);
        // console.log("sad", callBack);
        resolve(callBack);
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
async function getNewToken(oauth2Client, callback) {
  return new Promise((resolve, reject) => {
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES,
    });
    console.log("Authorize this app by visiting this url: ", authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question("Enter the code from that page here: ", function (code) {
      rl.close();
      oauth2Client.getToken(code, async function (err, token) {
        if (err) {
          let e = "Error while trying to retrieve access token" + err;
          console.log(e);
          reject(e);
        }
        oauth2Client.credentials = token;
        storeToken(token);
        resolve(await callback(oauth2Client));
      });
    });
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
  fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
    if (err) throw err;
    console.log("Token stored to " + TOKEN_PATH);
  });
}

// Load client secrets from a local file.
const runYoutube = async (runFunction, params = []) => {
  return new Promise((resolve, reject) => {
    if (!runFunction) {
      reject("missing runFuncition");
    }
    fs.readFile(
      "/Users/spark/Desktop/reactApps/transferPlaylist/keys/client_secret.json",
      async function processClientSecrets(err, content) {
        if (err) {
          let e = "Error loading client secret file: " + err;
          console.log(e);
          reject(e);
        }
        console.log("content", JSON.parse(content));
        // Authorize a client with the loaded credentials, then call the YouTube API.
        const callBack = await authorize(JSON.parse(content), (auth) =>
          runFunction(auth, ...params)
        );
        console.log("a", callBack);
        resolve(callBack);
      }
    );
  });
};

export default runYoutube;
