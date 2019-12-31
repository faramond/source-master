const mysql = require('mysql');
const express = require('express');
const router = express.Router();
const app = express();
app.use(express.json());



var con = mysql.createConnection({
  host: "103.57.190.72",
  port: "3306",
  user: "vnsense_sa",
  password: "salonpro",
  database: "vnsense_salonpro"
});


exports.con = con;