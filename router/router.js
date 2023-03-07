import express from "express";
import {
  spotifyToYt,
  spotifyToYtAuth,
  spotifyToYtQuery,
} from "../components/spotify/spotifyToYt.js";
import { test, spotify, spotifyLogin } from "../src/spotify.js";
import { ytToSpotifyQuery, ytToSpotify } from "../src/youtube.js";

const router = express.Router();
router.get("/", test);

// * SPOTIFY
router.get("/spotify", spotify);
router.get("/spotifyLogin", spotifyLogin);
router.get("/spotifyGet", spotifyToYt);
router.get("/spotifyToYt", spotifyToYtQuery);
router.get("/spotifyToYt/:playlistId", spotifyToYtAuth);

// * YOUTUBE
router.get("/ytToSpotify", ytToSpotifyQuery);
router.get("/ytToSpotify/:playlistId", ytToSpotify);

export default router;
