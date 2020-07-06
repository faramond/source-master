const { Booking } = require('../models/booking');
let { Salon } = require('../models/salon');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const app = express();
app.use(express.json());
const { createNewConnection } = require('../lib/connection');
let { bookingUpload } = require('../lib/uploadToSQL');
const { createNewConnection2 } = require('../lib/connection');


/*router.get('/', async (req, res) => {
    try { 
        let con = createNewConnection();
        lat= parseInt(req.query.lat);
        long=parseInt(req.query.long);
      
         con.connect(function(err) {
            if (err) throw err;
            console.log("Connected!");
            var sql = "select * from( select cp.Company_ID, cp.Company_Name, cp.Company_Address, cp.Company_Address1, cp.salonid, cp.status, cl.Latitude as lat,cl.Longitude as lon, 111.111 *DEGREES(ACOS(LEAST(COS(RADIANS(?))  * COS(RADIANS(cl.Latitude)) * COS(RADIANS(?- cl.Longitude))  + SIN(RADIANS(?)) * SIN(RADIANS(cl.Latitude)), 1.0))) AS distance_in_km from Company_Profile cp, Salon sl, CompanyLocation cl  where cl.CompanyID=cp.Company_ID and cp.salonid=sl.salonid and sl.ServicesTypeID=?) as main_company_table order by distance_in_km";
            con.query(sql,[lat,long,lat,req.query.serviceType], function (err, result, fields) {
              if (err) throw err;
              console.log("fetch successful");
             res.send(result);
             
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

});*/


/*router.get('/branchDetails', async (req, res) => {
    try { 
        let con = createNewConnection();
        response = {};
        id= parseInt(req.query.company_ID);
      
         con.connect(function(err) {
            if (err) throw err;
            console.log("Connected!");
            var sql ="SELECT Company_Name as branch_name, Company_Address as branch_address, Company_Phone as branch_phone, if(open_mon=1,concat(hour_start_mon,'-',hour_end_mon),'closed') as monday_time, if(open_tue=1,concat(hour_start_tue,'-',hour_end_tue),'closed') as tuesday_time, if(open_wed=1,concat(hour_start_wed,'-',hour_end_wed),'closed') as wednesday_time, if(open_thu=1,concat(hour_start_thu,'-',hour_end_thu),'closed') as thursday_time, if(open_fri=1,concat(hour_start_fri,'-',hour_end_fri),'closed') as friday_time, if(open_sat=1,concat(hour_start_sat,'-',hour_end_sat),'closed') as saturday_time, if(open_sun=1,concat(hour_start_sun,'-',hour_end_sun),'closed') as sunday_time FROM Company_Profile Where Company_ID= ?";
            var sql1 = "Select ImageLoc as image_location from BranchImages where Branch_ID= ?";
            con.query(sql,[id], function (err, result, fields) {
              if (err) throw err;
              console.log("fetch successful");
              response.salonDetails = result;
              con.query(sql1,[id], function (err, result, fields) {
                if (err) throw err;
                console.log("fetch successful");
               response.image = result;
               res.send(response);
             con.end(function(err) {
              if (err) {
                return console.log('error:' + err.message);
              }
              console.log('Connection Closed');
            });
            });
        });
          

          });
          
        
    }
    catch (err) {
        res.status(400).send({ 'message': err.message });
        console.log('Bookings', err.message)
    }

});*/

/*router.get('/services', async (req, res) => {
    try { 
        let con = createNewConnection();
        id= parseInt(req.query.company_ID);
        id1= parseInt(req.query.ServicesTypeID); 
         con.connect(function(err) {
            if (err) throw err;
            console.log("Connected!");
            var sql = "Select ServicesID,ServicesName,Charge from Services where Salon_ID=? and ServicesTypeID=?";
            con.query(sql,[id,id1], function (err, result, fields) {
              if (err) throw err;
              console.log("fetch successful");
             res.send(result);
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

});

router.get('/otherBranches', async (req, res) => {
    try { 
        let con = createNewConnection();
        id= parseInt(req.query.salonid);
         
         con.connect(function(err) {
            if (err) throw err;
            console.log("Connected!");
            var sql = "SELECT  Company_Name as Branch_Name,Company_Address as Branch_Address,Company_Phone as Branch_Phone, cl.Latitude as Latitude, cl.Longitude as Longitude FROM Company_Profile cp, CompanyLocation cl , Salon sl Where cp.salonid=sl.salonid and cl.CompanyID=cp.Company_ID and sl.salonid= ?";
            con.query(sql,[id], function (err, result, fields) {
              if (err) throw err;
              console.log("fetch successful");
             res.send(result);
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

});*/

router.get('/', async (req, res) => {
  try {
    if (!req.query.status || req.query.status == "") {
      return res.send({ 'message': 'Status is mandatory' });
    }
    if (!req.query.isServed || req.query.isServed == "") {
      return res.send({ 'message': 'isServed is mandatory' });
    }
    if (req.query.status === "requested") {
      const bookings = await Booking.find().or([{ userName: req.query.userName }, { mobileNumber: req.query.mobileNumber }])
        .and({ status: req.query.status })
        .sort('appointmentDate');
      res.send(bookings);
    }
    else {
      const bookings = await Booking.find()
        .or({ isServed: true })
        .or({ status: "cancelled" })
        .and({ mobileNumber: req.query.mobileNumber })
        .sort({ appointmentDate: -1 });
      res.send(bookings);
    }

  }
  catch (err) {
    res.send({ 'message': err.message });
    console.log('Booking Get', err.message)
  }

});

router.get('/details', async (req, res) => {
  try {
    let conn = await createNewConnection2();
    var sql = "Select ImageLoc as image_location from BranchImages where Branch_ID= ?";
    photo = [];
    let bookings = await Booking.find().or([{ _id: req.query.id }])
      .select({ salonName: 1, appointmentDate: 1, locality: 1, servicesName: 1, dealName: 1, mirrorStar: 1, amountToPay: 1, created: 1, modeOfPayment: 1, salonID: 1 });

    if (bookings != null && bookings != [] && bookings != '') {
      ID = parseInt(bookings[0].salonID);
      let [rows, fields] = await conn.execute(sql, [ID]);
      if (rows != null && rows != [] && rows != '') {
        for (j = 0; j < rows.length; j++) {
          photo.push(rows[j].image_location);
        }
      }
      bookings = JSON.stringify(bookings);
      bookings = JSON.parse(bookings);
      bookings[0].image = photo;
    }
    const salon = await Salon.findOne({ salonID: ID }).select({ reviews: 1, avgRating: 1 });
    if (!salon) {
      bookings[0].avgRating = 0;
      bookings[0].NoOfReveiews = 0;
    }
    else {
      bookings[0].avgRating = salon.avgRating;
      bookings[0].NoOfReveiews = salon.reviews.length;
    }
    res.send(bookings);
  }
  catch (err) {
    res.send({ 'message': err.message });
    console.log('Booking Get', err.message)
  }

});

router.patch('/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate({ _id: req.params.id },
      {
        status: "cancelled",
        updated: new Date(),

      }, { new: true });

    if (!booking) return res.status(404).send({ 'message': 'The booking with the given _id  was not found.' });

    res.send(booking);
  }
  catch (err) {
    res.send({ 'message': err.message });
    console.log('Booking Patch', err.message)
  }


});

router.post('/', async (req, res) => {
  console.log(req.body.servicesName, "service");
  try {
    if ((req.body.servicesName == [] || req.body.servicesName == "") && (req.body.dealID == null || req.body.dealID == "")) { return res.send({ 'message': 'service or deal required' }); }

    if (req.body.dealID) {
      if (req.body.dealName == "" || req.body.dealName == null) { return res.send({ 'message': 'deal name required' }) }
    }
    let booking = await Booking.find()
    req.body.bookingID = '#' + (000000 + booking.length),
      req.body.isServed = false;
    req.body.status = "requested";
    req.body.salonID = req.body.Company_ID;
    req.body.salonName = req.body.Company_Name;
    req.body.locality = req.body.Company_Address;

    let bookingData = new Booking(req.body);
    bookingData = await bookingData.save();

    bookingUpload(bookingData);
    res.send(bookingData);
  }
  catch (err) {
    res.send({ 'message': err.message });
    console.log('Booking Post', err.message)
  }

});






module.exports = router; 