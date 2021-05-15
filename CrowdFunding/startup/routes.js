const express = require("express");
const error = require("../Middleware/error");
const creator = require("../routes/user");
const lister = require("../routes/lister");
const company = require("../routes/company");
const representative = require("../routes/representative");
const bodyParser = require("body-parser");
var cors = require("cors");

module.exports = function (app) {
  app.use(cors());
  app.options("*", cors());
  app.use(express.json());
  app.use(bodyParser.json());
  app.use(bodyParser.json({ limit: "50mb" }));
  app.use("/crowdfunding/user", creator);
  app.use("/crowdfunding/project", lister);
  app.use("/crowdfunding/company", company);
  app.use("/crowdfunding/copmanyRepresentative", representative);
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
  });

  app.use(error);
};
