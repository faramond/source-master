const { Booking } = require('../models/booking');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

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
        let bookingData = new Booking(req.body);
        bookingData = await bookingData.save();

        res.send(bookingData);
    }
    catch (err) {
        res.send({ 'message': err.message });
        console.log('Booking Post', err.message)
    }

});

router.patch('/:id', async (req, res) => {
    try {
        // req.body.updated = new Date()
        const booking = await Booking.findOneAndUpdate(req.params.id,
            {
                isServed: req.body.isServed,
                status: req.body.status,
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

router.get('/slots', async (req, res) => {
    try {


        let con = createNewConnection();
        let conn = await createNewConnection2();
        let dateTime = (req.query.date)
        let date = dateTime.substring(0, 10);
        let day = dateTime.getDay();
        salonID = parseInt(1);
        stylistID = parseInt(1);
        let salonSlots = [];
        let appointmentSlots = [];

        con.getConnection(function (err, connection) {
            if (err) {
                console.log('Booking slot', err.message)
                return res.status(400).send({ 'message': err.message });

            };
            console.log("Connected!");
            var sql = "select case when dayname(?) = 'Monday' and  open_mon is not null then hour_start_mon when dayname(?) = 'Tuesday' and  open_tue is not null then hour_start_tue when dayname(?) = 'Wednesday' and  open_wed is not null then hour_start_wed when dayname(?) = 'Thursday' and  open_thu is not null then hour_start_thu when dayname(?) = 'Friday' and  open_fri is not null then hour_start_fri when dayname(?) = 'Saturday' and  open_sat is not null then hour_start_sat when dayname(?) = 'Sunday' and  open_sun is not null then hour_start_sun else 'Closed' end as Saloon_Open_time, case when dayname(?) = 'Monday' and  open_mon is not null then hour_end_mon when dayname(?) = 'Tuesday' and  open_tue is not null then hour_end_tue when dayname(?) = 'Wednesday' and  open_wed is not null then hour_end_wed when dayname(?) = 'Thursday' and  open_thu is not null then hour_end_thu when dayname(?) = 'Friday' and  open_fri is not null then hour_end_fri when dayname(?) = 'Saturday' and  open_sat is not null then hour_end_sat when dayname(?) = 'Sunday' and  open_sun is not null then hour_end_sun else 'Closed' end as Saloon_Close_time from Company_Profile c, Employee e where not exists (select ? from Company_Profile c, Employee e, LeaveTransaction l where e.StylistID = l.StylistID and e.Salon_ID = l.Salon_ID and e.Branch_ID = l.Branch_ID and c.company_id = ? and e.StylistID = ? and ? between l.LeaveFrom and l.LeaveTo) and c.company_id = ? and e.StylistID = ?"
            connection.query(sql, [date, date, date, date, date, date, date, date, date, date, date, date, date, date, salonID, salonID, stylistID, date, salonID, stylistID], async function (err, result, fields) {
                if (err) {
                    console.log('Booking slot', err.message)
                    return res.status(400).send({ 'message': err.message });

                };
                console.log("fetch successful");
                if (result != [] && result != "" && result != null) {
                    startTime = parseInt(result[0].Saloon_Open_time.substring(0, 2));
                    endTime = parseInt(result[0].Saloon_Close_time.substring(0, 2));
                    checkStartTime = parseInt(result[0].Saloon_Open_time.substring(3, 5));
                    checkEndTime = parseInt(result[0].Saloon_Close_time.substring(3, 5));

                    if (checkStartTime != 0 && checkStartTime <= 30) {
                        startTime = startTime + 0.5;
                    }
                    else if (checkStartTime != 0 && checkStartTime > 30) {
                        startTime = startTime + 1;
                    }

                    if (checkEndTime != 0 && checkEndTime >= 30) {
                        endTime = endTime + 0.5;
                    }
                    salonTime = endTime - startTime;

                    for (i = 0; i < salonTime * 2; i++) {
                        salonSlots.push(startTime);
                        startTime = startTime + 0.5
                    }

                    let dateTimeSql = (dateTime).slice(0, 19).replace('T', ' ');

                    var sql_2 = "select App_Date from Company_Profile c, Employee e , Appointment a where e.StylistID =a.StylistID and e.Salon_ID = a.Salon_ID and e.Branch_ID = a.Branch_ID and c.company_id =? and e.StylistID =? and  App_Date > ? and App_Date < ?";
                    connection.query(sql_2, [salonID, stylistID, dateTimeSql, date + ' 23:59:59'], async function (err_2, result_2, fields) {
                        if (err_2) {
                            console.log('Booking slot', err_2.message)
                            return res.status(400).send({ 'message': err_2.message });

                        }

                        if (result_2 != [] && result_2 != "" && result_2 != null) {
                            for (i = 0; i < result_2.length; i++) {
                                temp = parseInt(result_2[i].App_Date.getHours());
                                if (parseInt(result_2[i].App_Date.getMinutes()) == 30) {
                                    temp = temp + 0.5;
                                }
                                appointmentSlots.push(temp);
                            }
                        }

                        res.send(appointmentSlots);
                    })
                }
                else {
                    res.send({ 'message': 'Either Salon is Closed or Employee is on Leave' })
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


module.exports = router; 