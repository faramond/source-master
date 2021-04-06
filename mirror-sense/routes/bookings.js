const { Booking } = require('../models/booking');
const express = require('express');
const router = express.Router();
const app = express();
app.use(express.json());
const { createNewConnection } = require('../lib/connection');
let { bookingUpload } = require('../lib/uploadToSQL');
let { bookingUpdate } = require('../lib/uploadToSQL');
const { createNewConnection2 } = require('../lib/connection');
var request = require('request');



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
      return res.status(400).send({ 'message': 'Status is mandatory' });
    }
    if (!req.query.isServed || req.query.isServed == "") {
      return res.status(400).send({ 'message': 'isServed is mandatory' });
    }
    if (req.query.status === "requested") {
      const bookings = await Booking.find().or([{ mobileNumber: req.query.mobileNumber, isServed: false }])
        .sort('appointmentDate');
      res.send(bookings);
    }
    else {
      const bookings = await Booking.find()
        .or({ status: "completed" })
        .or({ status: "cancelled" })
        .and({ mobileNumber: req.query.mobileNumber })
        .sort({ appointmentDate: -1 });
      res.send(bookings);
    }

  }
  catch (err) {
    res.status(400).send({ 'message': err.message });
    console.log('Booking Get', err.message)
  }

});

router.get('/details', async (req, res) => {
  try {
    let con = createNewConnection();
    let ID;
    var sql = "Select ImageLoc as image_location from BranchImages where Branch_ID= ?";
    photo = [];

    con.getConnection(async function (err, connection) {
      if (err) {
        console.log('booking get error', err.message)
        return res.status(400).send({ 'message': err.message });

      };


      let bookings = await Booking.findOne().or([{ _id: req.query.id }])
        .select({ salonName: 1, appointmentDate: 1, locality: 1, servicesName: 1, dealName: 1, mirrorStar: 1, amountToPay: 1, created: 1, modeOfPayment: 1, branchID: 1, startTime: 1, endTime: 1 });

      if (!bookings) { return res.status(404).send({ 'message': 'The booking with the given _id  was not found.' }); }
      ID = parseInt(bookings.branchID);
      connection.query(sql, [ID], async function (err, rows, fields) {
        if (err) {
          console.log('booking get error', err.message)
          return res.status(400).send({ 'message': err.message });

        };
        if (rows != null && rows != [] && rows != '') {
          for (j = 0; j < rows.length; j++) {
            photo.push(rows[j].image_location);
          }
        }
        bookings = JSON.stringify(bookings);
        bookings = JSON.parse(bookings);
        bookings.image = photo;


        var sql_2 = "Select avgRating from Company_Profile where Company_ID = ? "
        var sql_1 = "Select review from Reviews where BranchID = ?"
        connection.query(sql_1, [ID], async function (err_1, rows_1, fields) {
          if (err) {
            console.log('booking get error', err_1.message)
            return res.status(400).send({ 'message': err_1.message });

          };
          connection.query(sql_2, [ID], async function (err_2, result_2, fields) {
            if (err_2) {
              console.log('booking get error', err_2.message)
              return res.status(400).send({ 'message': err_2.message });

            };
            if (result_2 != [] && result_2 != "" && result_2 != null) {

              bookings.avgRating = parseFloat(result_2[0].avgRating);
              bookings.NoOfReveiews = rows_1.length;
            }
            else {
              bookings.avgRating = 0;
              bookings.NoOfReveiews = rows_1.length;
            }
            let array = [];
            array.push(bookings)
            res.status(200).send(array);
          })
        })
      })
      connection.release();


    });
  }
  catch (err) {
    res.status(400).send({ 'message': err.message });
    console.log('Booking Get', err.message)
  }

});

router.patch('/:id', async (req, res) => {
  try {
    let con = createNewConnection();
    const booking = await Booking.findByIdAndUpdate({ _id: req.params.id },
      {
        status: "cancelled",
        isServed: "true",
        updated: new Date(),

      }, { new: true });

    if (!booking) return res.status(404).send({ 'message': 'The booking with the given _id  was not found.' });

    res.status(200).send(booking);

    bookingUpdate(0, 1, booking.AppID);

    notification(false, booking);



  }
  catch (err) {
    res.status(400).send({ 'message': err.message });
    console.log('Booking Patch', err.message)
  }


});

router.post('/', async (req, res) => {

  try {
    let con = createNewConnection();
    if ((req.body.servicesName == [] || req.body.servicesName == "") && (req.body.dealID == null || req.body.dealID == "")) { return res.send({ 'message': 'service or deal required' }); }

    if (req.body.dealID) {
      if (req.body.dealName == "" || req.body.dealName == null) { return res.send({ 'message': 'deal name required' }) }
    }
    let booking = await Booking.find()
    req.body.bookingID = '#' + (000000 + booking.length),
      req.body.isServed = false;
    req.body.status = "payment pending";
    if (req.body.modeOfPayment == "Cash") {
      req.body.status = "requested";
    }
    req.body.branchID = req.body.Company_ID;
    req.body.salonID = req.body.salonid;
    req.body.salonName = req.body.Company_Name;
    req.body.locality = req.body.Company_Address;

    let bookingData = new Booking(req.body);
    bookingData = await bookingData.save();

    res.status(201).send(bookingData);

    bookingUpload(bookingData);


    if (bookingData.servicesName != null && bookingData.servicesName != []) {
      if (req.body.status == "requested") {

        notification(true, bookingData);
      }


    }


  }
  catch (err) {
    res.status(400).send({ 'message': err.message });
    console.log('Booking Post', err.message)
  }

});



router.get('/slots', async (req, res) => {
  try {

    let con = createNewConnection();
    let conn = await createNewConnection2();
    let dateTime = (req.query.date)
    let date = dateTime.substring(0, 10);
    let day = (new Date(dateTime)).getDay();
    let dateTimeSql = (dateTime).slice(0, 19).replace('T', ' ');
    salonID = parseInt(req.query.salonID);
    branchID = parseInt(req.query.Company_ID);
    stylistID = parseInt(req.query.stylistID);
    let salonSlots = [];
    let appointmentSlots = [];
    let tempSlots = [];
    let dayName = "";


    if (day == 0) {
      day = 7;
      dayName = "open_sun"
    }
    if (day == 1) {
      dayName = "open_mon";
    }
    else if (day == 2) {
      dayName = "open_tue";
    }
    else if (day == 3) {
      dayName = "open_wed";
    }
    else if (day == 4) {
      dayName = "open_thu";
    }
    else if (day == 5) {
      dayName = "open_fri";
    }
    else if (day == 6) {
      dayName = "open_sat";
    }

    con.getConnection(function (err, connection) {
      if (err) {
        console.log('Booking slot', err.message)
        return res.status(400).send({ 'message': err.message });

      };
      console.log("Connected!");
      var sql = "select " + dayName + " as dayName from Company_Profile where Company_ID = ? and not exists  ( select OffDayID from OffDay where Offdate= ? and Salon_ID = ? )";
      var sql_2 = "select LeaveTransactionID from LeaveTransaction where StylistID = ? and ? between LeaveFrom and LeaveTo ";
      var sql_3 = "select TimeSlot from TimeSlot where Day=? and Salon_ID=? and StylistID=?";
      var sql_4 = "select TimeSlot from TimeSlot where Day=? and Salon_ID=? and StylistID= 0";
      var sql_5 = "select TimeSlot from TimeSlot where Day=? and Salon_ID=0 and StylistID= 0";
      var sql_6 = "select TimeSlot from TimeSlot where Day='' and Salon_ID=0 and StylistID= 0";
      var sql_7 = "select StartTime from Appointment  where StylistID = ? and Salon_ID = ? and App_Date > ? and App_Date < ? and Status != 1 and Done = 0 and DealID = 0";
      connection.query(sql, [branchID, date, salonID], async function (err, result, fields) {
        if (err) {
          console.log('Booking slot', err.message)
          return res.status(400).send({ 'message': err.message });

        };
        console.log(result)
        console.log("fetch successful");
        if (result != [] && result != "" && result != null) {
          if (result[0].dayName == 1) {

            connection.query(sql_2, [stylistID, date], async function (err_2, result_2, fields) {
              if (err_2) {
                console.log('Booking slot', err_2.message)
                return res.status(400).send({ 'message': err_2.message });

              };

              if (result_2 == null || result_2.length == 0) {

                const [rows, fields] = await conn.execute(sql_3, [day, salonID, stylistID])
                if (rows == null || rows.length == 0) {

                  const [rows_1, fields] = await conn.execute(sql_4, [day, salonID])
                  if (rows_1 == null || rows_1.length == 0) {

                    const [rows_2, fields] = await conn.execute(sql_5, [day])
                    if (rows_2 == null || rows_2.length == 0) {

                      const [rows_3, fields] = await conn.execute(sql_6)
                      if (rows_3 == null || rows_3.length == 0) {
                        return res.status(200).send({ 'message': 'No Slots Found for The Selected Date' })
                      }
                      else {
                        tempSlots.push(rows_3)
                      }
                    }
                    else {
                      tempSlots.push(rows_2)
                    }
                  }
                  else {
                    tempSlots.push(rows_1)
                  }
                }
                else {
                  tempSlots.push(rows)
                }
              }
              else {
                return res.status(200).send({ 'message': 'Sorry!! Employee is on Leave on The Selected Date' })
              }

              for (i = 0; i < tempSlots[0].length; i++) {
                salonSlots.push(tempSlots[0][i].TimeSlot)
              }

              connection.query(sql_7, [stylistID, salonID, dateTimeSql, date + ' 23:59:59'], async function (err_7, result_7, fields) {
                if (err_7) {
                  console.log('Booking slot', err_7.message)
                  return res.status(400).send({ 'message': err_7.message });

                }

                if (result_7 != [] && result_7 != "" && result_7 != null) {

                  for (i = 0; i < result_7.length; i++) {
                    appointmentSlots.push(result_7[i].StartTime.substring(0, 5))
                  }
                }


                temp = parseInt(dateTime.substring(11, 13))
                if (parseInt(dateTimeSql.substring(14, 16)) >= 30) {
                  temp = temp + 1;
                  temp = temp + ":" + "00";
                }
                else {
                  temp = temp + ":" + "30";
                }

                if (parseInt(salonSlots[0].substring(0, 2)) <= parseInt(temp.substring(0, 2))) {
                  if ((parseInt(salonSlots[salonSlots.length - 1].substring(0, 2)) > parseInt(temp.substring(0, 2)))
                    || ((parseInt(salonSlots[salonSlots.length - 1].substring(0, 2)) == parseInt(temp.substring(0, 2)))
                      && (parseInt(salonSlots[salonSlots.length - 1].substring(3, 5)) > parseInt(temp.substring(3, 5))))) {

                    index = salonSlots.indexOf(temp)
                    salonSlots = salonSlots.slice(index)
                  }
                  else {
                    return res.status(200).send({ 'message': " Sorry!!  Salon is Now Closed" });
                  }
                }

                console.log(appointmentSlots, "kl")
                for (i = 0; i < appointmentSlots.length; i++) {
                  ind = salonSlots.indexOf(appointmentSlots[i]);
                  salonSlots.splice(ind, 1);
                }

                if (salonSlots.length == 0) {
                  return res.status(200).send({ 'message': " Sorry!!  all Slots are Booked for The Selected Date " })
                }


                res.status(200).send(salonSlots)


              })

            })
          }
          else {
            res.status(200).send({ 'message': 'Salon is Closed on The Selected Date' })
          }
        }
        else {
          res.status(200).send({ 'message': 'Salon is Closed on The Selected Date' })
        }
        connection.release();


      });
    });


  }
  catch (err) {
    res.status(400).send({ 'message': err.message });
    console.log('Bookings', err.message)
  }

});




function notification(flag, bookingData) {

  try {
    let con = createNewConnection();

    con.getConnection(function (err, connection) {
      if (err) {
        console.log('appointment error', err.message)
        return console.log({ 'message': err.message });

      };
      let ID = parseInt(bookingData.StylistID)
      let device;
      var sql = "Select DeviceID  from Employee where StylistID = ?"
      connection.query(sql, [ID], async function (err, result, fields) {
        if (err) {
          console.log('appointment error', err.message)
          return console.log({ 'message': err.message });

        };
        if (result != [] && result != "" && result != null) {
          device = result[0].DeviceID
        }
        else {
          console.log({ 'message': 'device id not fpound for employee in new booking notification' });
        }

        let service = "";
        let flg = true;

        for (i = 0; i < bookingData.servicesName.length; i++) {
          if (flg) {
            service = bookingData.servicesName[0]
            flg = false;
          }
          else {
            service = service + ", " + bookingData.servicesName[i];
          }
        }

        let Body = {};

        if (flag) {
          Body = {
            "title": "New Booking Recieved: Sheduled at " + bookingData.appointmentDate,
            "body": bookingData.userName + " Booked for " + service
          }
        }
        else {
          Body = {
            "title": "Booking Sheduled at " + bookingData.appointmentDate + " is Cancelled",
            "body": bookingData.userName + " Cancelled Booking for " + service
          }
        }


        request.post({
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'key=AAAA_ec3JCs:APA91bEPs29D2Lh0imGMIIej0n8c2-_aLll0ie52s3XbzrXFvMtaXmRYgpAGkPvmRvVrhyl2C3S5KkutNDdpsKPGny1onY5yaVpSQJGImvWRFyXeETiiQBYYl_EffQ36GhaFLyEF0YtY'
          },
          url: 'https://fcm.googleapis.com/fcm/send',
          body: JSON.stringify({
            "to": device,
            "notification": Body,
            "data": {
              "click_action": "FLUTTER_NOTIFICATION_CLICK",
              "body": {
                "code": 100,
                "codeTitle": "New Booking",
                "_id": bookingData._id
              }
            }

          })
        }, function (error, response, body) {
          if (error) {
            console.log('Booking created by customer notification', error.message)
          }
        });

        request.post({
          headers: { 'Content-Type': 'application/json' },
          url: 'http://159.89.155.62:3000/mirror/api/notification',
          body: JSON.stringify({
            "employee": JSON.stringify(bookingData.StylistID),
            "data": JSON.stringify({
              "click_action": "FLUTTER_NOTIFICATION_CLICK",
              "body": {
                "code": 100,
                "codeTitle": "New Booking",
                "_id": bookingData._id
              }
            })

          })
        }, function (error, response, body) {
          if (error) {
            console.log('Booking created by customer notification save ', error.message)
          }
        });
      })
      connection.release();


    });




  }
  catch
  (err) {
    console.log('Bookings notification', err.message)
  }
}






module.exports = router;


