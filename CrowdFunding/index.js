const config = require("config");
const mongoose = require("mongoose");
const express = require("express");
const dotenv = require("dotenv");
require("express-async-errors");
const fs = require("fs");
const { parse, stringify } = require("envfile");
const sourcePath = ".env";
const app = express();

require("./startup/routes")(app);

// generating the secret which will serve as a key for JWT
/*const secret = require("crypto").randomBytes(64).toString("hex");

// saving the secret in .env file
let parsedFile = parse(sourcePath);
parsedFile.cf_jwtPrivateKey = secret;
parsedFile.NODE_ENV = "dev";
fs.writeFileSync("./.env", stringify(parsedFile));

// setting the enviorment variable via dotenv module
dotenv.config();*/

// checking if the enviorment variable is set or not via config
//if (!config.get("jwtPrivateKey")) {
// console.error("Fatal Error: jwtPrivateKey is not defined");
// process.exit(1);
//}

mongoose
  .connect("mongodb://localhost:61099/cf_dev_db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
