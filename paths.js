import path from "path";
import { fileURLToPath } from "url";

export const __filename = fileURLToPath(import.meta.url);

export const __dirname = path.dirname(__filename);
export const urlLocalhostIp = "http://192.168.18.107:3000/"
export const urlLocalhost = "http://localhost:3000/"

// SPOTIFY
export const urlSpRedirect = "http://localhost:3000/spotify";
export const urlSpRedirectGet = "http://localhost:3000/spotifyGet"
// const spotifyPlaylists = "https://api.spotify.com/v1/me/playlists";
export const urlSpotifySearch = "https://api.spotify.com/v1/search?";
export const urlSpToken = "https://accounts.spotify.com/api/token";
export const urlSpCreatePlaylist = (user_id) =>
  `https://api.spotify.com/v1/users/${user_id}/playlists`;
export const urlSpPlaylistTracks = (playlist_id) =>
  `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`;
export const urlCurrentUser = "https://api.spotify.com/v1/me";

// YOUTUBE
