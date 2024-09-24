// ENV
import dotenv from "dotenv";
dotenv.config();
console.log(process.env.TEST);

import express from "express";
import router from "./router/router.js";
import cors from "cors";
import { __dirname } from "./paths.js";

// VARIABLES
const app = express();
export const NODE_ENV = app.settings.env;
app.use(cors({ origin: "*", methods: "GET" }));
const port = 3000;

// SETUP EJS
// set the view engine to ejs
app.set("view engine", "ejs");

// LISTEN
app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});

// STATIC FILE PATH
app.use(express.static(__dirname));

// ROUTES
app.use("/", router);
app.get("/health", (req, res) => {
  res.send("OK");
});
