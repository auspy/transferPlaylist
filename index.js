// ENV
import dotenv from "dotenv";
dotenv.config();
console.log(process.env.TEST);

import express from "express";
import router from "./router/router.js";


// VARIABLES
const app = express();

// LISTEN
app.listen(3000, () => {
    console.log(`App listening on port 3000!`);
});

// ROUTES
app.use("/",router)


