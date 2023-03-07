import ytAddPlaylistItems from "./addPlaylistItems.js";
import ytCreatePlaylist from "./createPlaylist.js";
import ytGetAuth from "./quickstart.js";

/**
 * @param {Object[]} dataIds Contains all ids of searched resource
 * @param {string} playlistTitle The string
 */
export default async function ytNewPlaylistSetup(dataIds, playlistTitle) {
  const auth = await ytGetAuth();
  const results = [];
  if (!auth) {
    return "missing auth";
  }
  const playlistId = await ytCreatePlaylist(auth, playlistTitle);
  if (playlistId) {
    for (const id of dataIds) {
      if (id?.videoId) {
        results.push(await ytAddPlaylistItems(auth, playlistId, id.videoId));
      } else {
        results.push("missing videoId");
      }
    }
  }
  return results;
}
