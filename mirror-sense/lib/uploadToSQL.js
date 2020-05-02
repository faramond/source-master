const mysql = require('mysql');
const { Customer } = require('../models/customer');
const express = require('express');
const router = express.Router();
const app = express();
app.use(express.json());
const { createNewConnection } = require('../lib/connection');







function customerUpload(customer,callback) {
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
              return  callback(result);
            });
          });
      
        
    

}

function customerUpdate(customer) {
  let con = createNewConnection();
  AccountNo= parseInt(customer.AccountNo);
  var gender;
  if(customer.gender === "male")
  gender = "M";
  if(customer.gender === "female")
  gender = "F";

   if(customer.profile){
    con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
        var sql = "UPDATE Customer Set Email = ?, DOB = ?, Gender = ?, image = ? where AccountNo = ? ";
        con.query(sql,[customer.email, customer.dob, gender, customer.profile, AccountNo], function (err, result) {
          if (err) throw err;
          console.log("1 record inserted");
        });
      });
    
   }

   else{
    con.connect(function(err) {
      if (err) throw err;
      console.log("Connected!");
      var sql = "UPDATE Customer Set Email = ?, DOB = ?, Gender = ? where AccountNo = ? ";
      con.query(sql,[customer.email, customer.dob, gender, AccountNo], function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
      });
    });
  
 }
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

async function  bookingUpload(bookingData){
  try { 
    let con = createNewConnection();
    if(bookingData.StylistID != null && bookingData.StylistID != ''){
      id= parseInt(bookingData.StylistID);}
    id_1= parseInt(bookingData.salonID);
    id_2= parseInt(bookingData.salonid);
    if(bookingData.dealID != null && bookingData.dealID != ''){
    id_3= parseInt(bookingData.dealID); }
    var date = new Date(bookingData.appointmentDate).toISOString().slice(0, 19).replace('T', ' ');
    var date_1 = new Date(bookingData.created).toISOString().slice(0, 19).replace('T', ' ');

     customer = await Customer.find().or([{ _id: bookingData.customer }]).select({AccountNo: 1});
     if(customer != null && customer!= [] && customer != ''){
     customer = customer[0].AccountNo;}
     else{
       customer = 0;
     }


    if(bookingData.servicesName != null && bookingData.servicesName != [] && bookingData.servicesName != '')
    {var data = bookingData.servicesName[0];
    for(i=1;i<bookingData.servicesName.length;i++){
      data = (data + ',' + bookingData.servicesName[i]);}

     con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
        var sql =  "INSERT INTO Appointment ( App_Date, StylistID, Customer, Service, Done, PhoneNumber, Salon_ID, Branch_ID, Status, CreatedOn) VALUES ( ?,?,?,?,?,?,?,?,?,?)";
         con.query(sql,[date,id,customer,data,0,bookingData.mobileNumber,id_2,id_1,0,date_1], function (err, result, fields) {
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

    else{
      con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
        var sql =  "INSERT INTO Appointment ( App_Date,DealID, Customer, Done, PhoneNumber, Salon_ID, Branch_ID, Status, CreatedOn) VALUES ( ?,?,?,?,?,?,?,?,?)";
         con.query(sql,[date,id_3,customer,0,bookingData.mobileNumber,id_2,id_1,0,date_1], function (err, result, fields) {
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