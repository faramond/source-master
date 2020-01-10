const {Booking} = require('../models/booking');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const app = express();
app.use(express.json());
const { createNewConnection } = require('../lib/connection');
let { bookingUpload } = require('../lib/uploadToSQL');


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
        const bookings = await Booking.find().or([{ userName: req.query.userName }, { mobileNumber: req.query.mobileNumber }])
        .and({ isServed: req.query.isServed })    
        .sort('name');
        res.send(bookings);
    }
    catch (err) {
        res.send({ 'message': err.message });
        console.log('Booking Get', err.message)
    }

});

router.post('/', async (req, res) => {
    try {
        let booking = await Booking.find()
        req.body.bookingID = '#' + (000000 + booking.length),
        req.body.isServed = false;
        req.body.status = "requested";
        req.body.salonID = req.body.Company_ID;
        req.body.salonName = req.body.Company_Name;
        req.body.locality = req.body.Company_Address;

        let bookingData = new Booking(req.body);
        bookingData = await bookingData.save();

       // bookingUpload(bookingData);
        res.send(bookingData);
    }
    catch (err) {
        res.send({ 'message': err.message });
        console.log('Booking Post', err.message)
    }

});






module.exports = router; 