import path from "path";
import { fileURLToPath } from "url";

export const __filename = fileURLToPath(import.meta.url);

export const __dirname = path.dirname(__filename);
export const urlLocalhostIp = "http://192.168.18.107:3000/";
export const urlLocalhost = "http://localhost:3000/";

// SPOTIFY
export const __DEV__ = process.env.NODE_ENV == "development";
const aws = "https://www.transferplaylist.world/";
export const urlSpRedirect = __DEV__ ? urlLocalhost : aws + "spotify";
export const urlSpRedirectGet = __DEV__ ? urlLocalhost : aws + "spotifyGet";
// const spotifyPlaylists = "https://api.spotify.com/v1/me/playlists";
export const urlSpotifySearch = "https://api.spotify.com/v1/search?";
export const urlSpToken = "https://accounts.spotify.com/api/token";
export const urlSpCreatePlaylist = (user_id) =>
  `https://api.spotify.com/v1/users/${user_id}/playlists`;
export const urlSpPlaylistTracks = (playlist_id) =>
  `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`;
export const urlCurrentUser = "https://api.spotify.com/v1/me";

// YOUTUBE
