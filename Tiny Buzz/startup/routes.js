const express = require("express");
const news = require("../routes/news");
const creator = require("../routes/creator");
const language = require("../routes/language");
const country = require("../routes/country");
const device = require("../routes/device");
const notification = require("../routes/notification");
const stats = require("../routes/stats");
const mailer = require("../routes/mailer");
const bodyParser = require("body-parser");
var cors = require("cors");

module.exports = function (app) {
  app.use(cors());
  app.options("*", cors());
  app.use(express.json());
  app.use(bodyParser.json());
  app.use(bodyParser.json({ limit: "50mb" }));
  app.use("/", news);
  app.use("/tinnyBuzz/creator", creator);
  app.use("/tinnyBuzz/language", language);
  app.use("/tinnyBuzz/country", country);
  app.use("/tinnyBuzz/device", device);
  app.use("/tinnyBuzz/notification", notification);
  app.use("/tinnyBuzz/stats", stats);
  app.use("/tinnyBuzz/mailer", mailer);
  app.use("/uploads", express.static("./uploads"));
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    next();
  });
};
