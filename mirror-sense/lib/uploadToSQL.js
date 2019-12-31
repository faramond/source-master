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




function customerUpload(customer) {
       var date = new Date(customer.created).toISOString().slice(0, 19).replace('T', ' ');
        con.connect(function(err) {
            if (err) throw err;
            console.log("Connected!");
            var sql = "INSERT INTO Customer ( CustomerName, RegionCode, PhoneNumber, CreatedOn) VALUES ( ?,?,?,?)";
            con.query(sql,[customer.fullName, customer.countryCode, customer.mobileNumber, date], function (err, result) {
              if (err) throw err;
              console.log("1 record inserted");
            });
          });

         /* con.end(function(err) {
            if (err) {
              return console.log('error:' + err.message);
            }
            console.log('Close the database connection.');
          });*/
      
        
    

}

function customerUpdate(customer,photo) {
  console.log(photo,"a");

  var gender;
  if(customer.gender === "male")
  gender = M;
  if(customer.gender === "female")
  gender = F;


    con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
        var sql = "UPDATE Customer Set Email = ?, DOB = ?, Gender = ?, ImagePhoto = ? where PhoneNumber = ? ";
        con.query(sql,[customer.email, customer.dob, gender, photo, customer.mobileNumber], function (err, result) {
          if (err) throw err;
          console.log("1 record inserted");
        });
      });
    
    


}




exports.customerUpload = customerUpload;
exports.customerUpdate = customerUpdate;