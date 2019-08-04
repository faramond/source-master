const winston = require('winston');
const mongoose = require('mongoose');
const config = require('config');
const mysql = require('mysql');
let option= { useNewUrlParser: true }

module.exports = function() {
  const db = config.get('db');
  mongoose.connect(db)
    .then(() => winston.info(`Connected to ${db},${option}...`));
}

const mysqlCon = mysql.createConnection({
  host: "103.57.190.72",
  port:3306,
  database: "vnsense_salonpro",
  user: "vnsense_sa",
  password: "salonpro"
});

mysqlCon.connect(function(err) {
  if (err) throw err;
  console.log("Mirror Database Connected!");
});

exports.mysqlCon = mysqlCon;

