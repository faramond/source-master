const express = require("express");
const error = require("../Middleware/error");
const creator = require("../routes/user");
const lister = require("../routes/lister");
const company = require("../routes/company");
const representative = require("../routes/representative");
const role = require("../routes/role");
const currency = require("../routes/currency");
const stats = require("../routes/stats");
const bodyParser = require("body-parser");
var cors = require("cors");

const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Crowd_Funding API",
      version: "1.0.0",
      description: "Crowd_Funding API Information",
      servers: ["http://35.193.38.190:3000/crowdfunding"],
    },
  },
  apis: ["../routes/lister.js"],
};

const swaggerDocs = swaggerJsdoc(options);

module.exports = function (app) {
  app.use(cors());
  app.options("*", cors());
  app.use(express.json());
  app.use(bodyParser.json());
  app.use(bodyParser.json({ limit: "50mb" }));
  app.use("/crowdfunding/user", creator);
  app.use("/crowdfunding/project", lister);
  app.use("/crowdfunding/company", company);
  app.use("/crowdfunding/representative", representative);
  app.use("/crowdfunding/role", role);
  app.use("/crowdfunding/currency", currency);
  app.use("/crowdfunding/stats", stats);
  app.use("/uploads", express.static("./uploads"));
  app.use("/projectDoc", express.static("./projectDoc"));
  app.use(
    "/crowdfunding/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocs)
  );
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
  });

  app.use(error);
};
