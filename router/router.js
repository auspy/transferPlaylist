import express from "express";
import results from "../components/results.js";
import { spotify, spotifyLogin, test } from "../components/spotify.js";
import { ytToSpotifyQuery, ytToSpotify } from "../components/youtube.js";
import {
  spotifyToYt,
  spotifyToYtAuth,
  spotifyToYtQuery,
} from "../components/spotify/spotifyToYt.js";
import {
  removeYtAccount,
  youtubeCallback,
} from "../components/youtube/quickstart.js";
import privacyPolicy from "../components/privacyPolicy.js";
import termsOfService from "../components/termsOfService.js";

const router = express.Router();
router.get("/", test);
router.get("/results", results);
router.get("/privacyPolicy",privacyPolicy)
router.get("/termsOfService",termsOfService)

// * SPOTIFY
router.get("/spotify", spotify);
router.get("/spotifyLogin", spotifyLogin);
router.get("/spotifyGet", spotifyToYt);
router.get("/spotifyToYt", spotifyToYtQuery);
router.get("/spotifyToYt/:playlistId", spotifyToYtAuth);

// * YOUTUBE
router.get("/ytToSpotify", ytToSpotifyQuery);
router.get("/ytToSpotify/:playlistId", ytToSpotify);
router.get("/youtubeCallback", youtubeCallback);
router.post("/removeYtAccount", removeYtAccount);

export default router;
