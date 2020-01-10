const mysql = require('mysql');
const express = require('express');
const router = express.Router();
const app = express();
app.use(express.json());
const { createNewConnection } = require('../lib/connection');







function customerUpload(customer) {
  let con = createNewConnection();
       var date = new Date(customer.created).toISOString().slice(0, 19).replace('T', ' ');
        con.connect(function(err) {
            if (err) throw err;
            console.log("Connected!");
            var sql = "INSERT INTO Customer ( CustomerName, RegionCode, PhoneNumber, CreatedOn) VALUES ( ?,?,?,?)";
            con.query(sql,[customer.fullName, customer.countryCode, customer.mobileNumber, date], function (err, result) {
              if (err) throw err;
              console.log("1 record inserted");
              con.end(function(err) {
                if (err) {
                  return console.log('error:' + err.message);
                }
                console.log('Close the database connection.');
              });
            });
          });
      
        
    

}

function customerUpdate(customer,photo) {
  let con = createNewConnection();
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


  function  getEmployee(ID, callback){
  try { 
    let con = createNewConnection();
    id= parseInt(ID); 
     con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
        var sql = "select FullName,StylistID,PhoneNumber,Password,PhotoDir,Email,DOB,Gender,CreatedOn,DateReg,DateResign,Address,AboutMe from Employee where Branch_ID=? and Usernm!='admin'";
         con.query(sql,[id], function (err, result, fields) {
          if (err) throw err;
          console.log("fetch successful");
         con.end(function(err) {
          if (err) {
            return console.log('error:' + err.message);
          }
          console.log('Connection Closed');
        });
        return  callback(result);
        });
      

      });
      
    
}
catch (err) {
    res.status(400).send({ 'message': err.message });
    console.log('Bookings', err.message)
}
}

function  bookingUpload(bookingData){
  try { 
    let con = createNewConnection();
    id= parseInt(bookingData.StylistID);
    id_1= parseInt(bookingData.salonID);
    id_2= parseInt(bookingData.salonid);
    var date = new Date(bookingData.appointmentDate).toISOString().slice(0, 19).replace('T', ' ');
    var date_1 = new Date(bookingData.created).toISOString().slice(0, 19).replace('T', ' ');
    var data = bookingData.servicesName[0];
    for(i=1;i<bookingData.servicesName.length;i++){
      data = (data + ',' + bookingData.servicesName[i]);}
      console.log(data,"a");

     con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
        var sql =  "INSERT INTO Appointment ( App_Date, StylistID, Customer, Service, Done, PhoneNumber, Salon_ID, Branch_ID, Status, CreatedOn) VALUES ( ?,?,?,?,?,?,?,?,?,?)";
         con.query(sql,[date,id,0,data,0,bookingData.mobileNumber,id_2,id_1,0,date_1], function (err, result, fields) {
          if (err) throw err;
          console.log("fetch successful");
         con.end(function(err) {
          if (err) {
            return console.log('error:' + err.message);
          }
          console.log('Connection Closed');
        });
        
        });
      

      });
      
    
}
catch (err) {
    res.status(400).send({ 'message': err.message });
    console.log('Bookings', err.message)
}
}


exports.customerUpload = customerUpload;
exports.customerUpdate = customerUpdate;
exports.getEmployee = getEmployee;
exports.bookingUpload = bookingUpload;