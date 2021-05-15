const mongoose = require("mongoose");
const express = require("express");
require("express-async-errors");
const app = express();

require("./startup/routes")(app);

mongoose
  .connect("mongodb://localhost:61099/cf_dev_db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
