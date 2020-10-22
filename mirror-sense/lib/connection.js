const mysql2 = require('mysql2/promise');
const mysql = require('mysql');
const express = require('express');
const router = express.Router();
const app = express();
app.use(express.json());



function createNewConnection() {
  try {
    console.log("connection called");
    var con = mysql.createPool({
      host: "103.57.190.72",
      port: "3306",
      user: "vnsense_sa",
      password: "salonpro",
      database: "vnsense_salonpro",
      connectionLimit: 100,
    });
    return con;
  }
  catch (err) {
    console.log('Sql Connection', err.message)
  }
}

async function createNewConnection2() {
  try {
    console.log("connection called");
    var conn = await mysql2.createConnection({
      host: "103.57.190.72",
      port: "3306",
      user: "vnsense_sa",
      password: "salonpro",
      database: "vnsense_salonpro"
    });
    return conn;
  }
  catch (err) {
    console.log('Sql2 Connection', err.message)
  }
}

function createNewConnectionMerchant() {
  try {
    console.log("connection called");
    var con = mysql.createPool({
      host: "103.57.190.72",
      port: "3306",
      user: "mysense_sa",
      password: "salonpro",
      database: "mysense_salonpro"
    });
    return con;
  }
  catch (err) {
    console.log('Sql Connection', err.message)
  }
}

function createNewConnection3() {
  try {
    console.log("connection called");
    return mysql.createConnection({
      host: "103.57.190.72",
      port: "3306",
      user: "vnsense_sa",
      password: "salonpro",
      database: "vnsense_salonpro"
    });
  }
  catch (err) {
    console.log('Sql Connection', err.message)
  }
}

exports.createNewConnection = createNewConnection;
exports.createNewConnection2 = createNewConnection2;
exports.createNewConnectionMerchant = createNewConnectionMerchant;
exports.createNewConnection3 = createNewConnection3;