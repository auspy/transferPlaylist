import express from "express";
import { test,spotify,login } from "../src/spotify.js";

const router = express.Router();
router.get("/",test)

// SPOTIFY
router.get("/spotifyCallback", spotify);
router.get("/spotifyLogin", login);

export default router