const mysql = require('mysql');
const express = require('express');
const router = express.Router();



var con = mysql.createConnection({
  host: "103.57.190.72",
  port: "3306",
  user: "vnsense_sa",
  password: "salonpro",
  database: "vnsense_salonpro"
});


con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    var sql = "INSERT INTO Customer (AccountNo, CustomerName, Gender, RegionCode, PhoneNumber, DateReg, RegisterNo, State, City, Postcode, DOB) VALUES ('5dea53118e30c31a3abc787b', 'Vivek', 'M', '91', '9990908583', '2019-12-18', 'cd0023', '856', 'india', '209863', '2000-01-01')";
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("1 record inserted");
    });
  });




module.exports = router; 