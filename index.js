// ENV
import dotenv from "dotenv";
dotenv.config();
console.log(process.env.TEST);

import express from "express";
import router from "./router/router.js";

// VARIABLES
const app = express();
const port = 3000;

// LISTEN
app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});

// ROUTES
app.use("/", router);
