const mysql = require('mysql');
const { Customer } = require('../models/customer');
const express = require('express');
const router = express.Router();
const app = express();
app.use(express.json());
const { createNewConnection } = require('../lib/connection');







function customerUpload(customer, callback) {
  let con = createNewConnection();
  var date = new Date(customer.created).toISOString().slice(0, 19).replace('T', ' ');
  con.getConnection(function (err, connection) {
    if (err) {
      console.log('customer upload', err.message)
    };
    console.log("Connected!");
    var sql = "INSERT INTO Customer ( CustomerName, RegionCode, PhoneNumber, CreatedOn) VALUES ( ?,?,?,?)";
    connection.query(sql, [customer.fullName, customer.countryCode, customer.mobileNumber, date], function (err, result) {
      if (err) {
        console.log('customer upload', err.message)
      };
      console.log("1 record inserted");
      connection.release();
      return callback(result);
    });
  });




}

function customerUpdate(customer) {
  let con = createNewConnection();
  AccountNo = parseInt(customer.AccountNo);
  var gender;
  if (customer.gender === "male")
    gender = "M";
  if (customer.gender === "female")
    gender = "F";

  if (customer.profile) {
    con.getConnection(function (err, connection) {
      if (err) {
        console.log('customer update', err.message)
      };
      console.log("Connected!");
      var sql = "UPDATE Customer Set Email = ?, DOB = ?, Gender = ?, image = ? where AccountNo = ? ";
      connection.query(sql, [customer.email, customer.dob, gender, customer.profile, AccountNo], function (err, result) {
        if (err) {
          console.log('customer update', err.message)
        };
        console.log("1 record inserted");
        connection.release();
      });
    });

  }

  else {
    con.getConnection(function (err, connection) {
      if (err) {
        console.log('customer upload', err.message)
      };
      console.log("Connected!");
      var sql = "UPDATE Customer Set Email = ?, DOB = ?, Gender = ? where AccountNo = ? ";
      connection.query(sql, [customer.email, customer.dob, gender, AccountNo], function (err, result) {
        if (err) {
          console.log('customer upload', err.message)
        };
        console.log("1 record inserted");
        connection.release();
      });
    });

  }
}





function getEmployee(callback) {
  try {
    let con = createNewConnection();
    con.getConnection(function (err, connection) {
      if (err) {
        console.log('get employee', err.message)
        result = { err }
        return callback(result)
      };
      console.log("Connected!");
      var sql = "select FullName,StylistID,PhoneNumber,Password,RegionCode,Usernm,PhotoDir,Email,DOB,Gender,CreatedOn,UpdatedOn,Salon_ID,Branch_ID,HeaderImage,DateReg,DateResign,Address,AboutMe from Employee where Usernm!='admin'";
      connection.query(sql, function (err, result, fields) {
        if (err) {
          console.log('get employee', err.message)
          result = { err }
          return callback(result);
        };
        console.log("fetch successful");
        connection.release();
        return callback(result);
      });


    });


  }
  catch (err) {
    res.status(400).send({ 'message': err.message });
    console.log('Bookings', err.message)
  }
}

async function bookingUpload(bookingData) {
  try {
    let con = createNewConnection();
    if (bookingData.StylistID != null && bookingData.StylistID != '') {
      id = parseInt(bookingData.StylistID);
    }
    id_1 = parseInt(bookingData.salonID);
    id_2 = parseInt(bookingData.salonid);
    if (bookingData.dealID != null && bookingData.dealID != '') {
      id_3 = parseInt(bookingData.dealID);
    }
    var date = new Date(bookingData.appointmentDate).toISOString().slice(0, 19).replace('T', ' ');
    var date_1 = new Date(bookingData.created).toISOString().slice(0, 19).replace('T', ' ');

    customer = await Customer.find().or([{ _id: bookingData.customer }]).select({ AccountNo: 1 });
    if (customer != null && customer != [] && customer != '') {
      customer = customer[0].AccountNo;
    }
    else {
      customer = 0;
    }


    if (bookingData.servicesName != null && bookingData.servicesName != [] && bookingData.servicesName != '') {
      var data = bookingData.servicesName[0];
      for (i = 1; i < bookingData.servicesName.length; i++) {
        data = (data + ',' + bookingData.servicesName[i]);
      }

      con.getConnection(function (err, connection) {
        if (err) {
          console.log('booking upload', err.message)
        };
        console.log("Connected!");
        var sql = "INSERT INTO Appointment ( App_Date, StylistID, Customer, Service, Done, PhoneNumber, Salon_ID, Branch_ID, Status, CreatedOn) VALUES ( ?,?,?,?,?,?,?,?,?,?)";
        connection.query(sql, [date, id, customer, data, 0, bookingData.mobileNumber, id_2, id_1, 0, date_1], function (err, result, fields) {
          if (err) {
            console.log('booking upload', err.message)
          };
          console.log("fetch successful");
          connection.release();

        });


      });
    }

    else if (id_3 != null || id_3 != "") {
      con.getConnection(function (err, connection) {
        if (err) {
          console.log('booking upload', err.message)
        };
        console.log("Connected!");
        var sql = "INSERT INTO Appointment ( App_Date,DealID, Customer, Done, PhoneNumber, Salon_ID, Branch_ID, Status, CreatedOn) VALUES ( ?,?,?,?,?,?,?,?,?)";
        connection.query(sql, [date, id_3, customer, 0, bookingData.mobileNumber, id_2, id_1, 0, date_1], function (err, result, fields) {
          if (err) {
            console.log('booking upload', err.message)
          };
          console.log("fetch successful");
          connection.release();

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