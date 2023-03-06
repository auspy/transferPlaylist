import express from "express";
import { test, spotify, login } from "../src/spotify.js";
import { ytGetPlaylistItemsOf, ytGetPlaylistItemsOfId } from "../src/youtube.js";

const router = express.Router();
router.get("/", test);

// * SPOTIFY
router.get("/spotify", spotify);
router.get("/spotifyLogin", login);
// router.get("/spotifySearch", );

// * YOUTUBE
router.get("/ytPlayist", ytGetPlaylistItemsOf);
router.get("/ytPlayist/:playlistId", ytGetPlaylistItemsOfId);

export default router;
