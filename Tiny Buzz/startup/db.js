const winston = require('winston');
const mongoose = require('mongoose');
const config = require('config');
const mysql = require('mysql');
let option = { useNewUrlParser: true }

module.exports = function () {
  const pwd = "O%c#ns#k$^^^Y)ug)ti!";
  const db = config.get('db');
  mongoose.connect("mongodb://nodeConnection:ncen27nnec19oin32@localhost:2919/mirror-sense")
    .then(() => winston.info(`Connected to ${db},${option}...`));

}

