import dotenv from "dotenv";
import express from "express";
import router from "./router/router.js";

// ENV
dotenv.config();
console.log(process.env.TEST);

// VARIABLES
const app = express();

// LISTEN
app.listen(3000, () => {
    console.log(`App listening on port 3000!`);
});

// ROUTES
app.use("/",router)


