const { MirrorStar } = require('../models/mirrorStar');
const { Events } = require('../models/events');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const { createNewConnection2 } = require('../lib/connection');
const { createNewConnection } = require('../lib/connection');

/*router.get('/', async (req, res) => {
    try {
        
       let result = [];
        let event = await MirrorStar.find().or([{ _id:req.query._id}])
        .select({ events: 1})
        for(let key in event[0].events)
    { 
    let data = await Events.find().or([{ _id: event[0].events[key].toString() }])
        result.push(data)
        
    }
    res.send(result);
}
    
    catch (err) {
        res.send({ 'message': err.message });
        console.log('Leave History', err.message)
    }

});*/


router.get('/', async (req, res) => {
    try {
        let conn = await createNewConnection2();
        let response = [];


        let event = await MirrorStar.findOne({ _id: req.query._id })
            .select({ events: 1 })

        if (event != [] && event != "" && event != null) {

            var sql_1 = "Select Location from EducationCourseImage where EducationCourseID = ?";
            var sql = "Select  EducationCourseID,CourseName, CourseDate ,ClosingDate ,Description, Address, Price,HeaderLocation from EducationCourse where EducationCourseID = ?";
            for (i = 0; i < event.events.length; i++) {
                let images = [];
                let id = parseInt(event.events[i]);
                let [rows_1, fields_1] = await conn.execute(sql, [id]);

                if (rows_1 != [] && rows_1 != "" && rows_1 != null) {
                    let [rows, fields] = await conn.execute(sql_1, [id]);
                    if (rows != [] && rows != "" && rows != null) {
                        for (j = 0; j < rows.length; j++) {
                            images.push(rows[j].Location);
                        }
                        temp = {
                            _id: rows_1[0].EducationCourseID,
                            eventName: rows_1[0].CourseName,
                            dateFrom: rows_1[0].CourseDate,
                            dateTo: rows_1[0].ClosingDate,
                            address: rows_1[0].Address,
                            description: rows_1[0].Description,
                            price: rows_1[0].Price,
                            logo: rows_1[0].HeaderLocation,
                            image: images
                        }
                        response.push(temp);
                    }

                    else {
                        temp = {
                            _id: rows_1[0].EducationCourseID,
                            eventName: rows_1[0].CourseName,
                            dateFrom: rows_1[0].CourseDate,
                            dateTo: rows_1[0].ClosingDate,
                            address: rows_1[0].Address,
                            description: rows_1[0].Description,
                            price: rows_1[0].Price,
                            logo: rows_1[0].HeaderLocation,
                            image: ""
                        }
                        response.push(temp);



                    }



                }


            }

            res.send(response);

        }

        else {
            res.send({ 'message': 'No Events Purchased' })
        }
    }

    catch (err) {
        res.send({ 'message': err.message });
        console.log('myevent', err.message)
    }

});

router.get('/details/:id', async (req, res) => {
    try {
        let con = createNewConnection();
        let conn = await createNewConnection2();
        id = parseInt(req.params.id);
        let images = [];
        let response;

        con.getConnection(function (err, connection) {
            if (err) {
                console.log('myevents', err.message)
                return res.status(400).send({ 'message': err.message });
            };
            console.log("Connected!");
            var sql_1 = "Select Location from EducationCourseImage where EducationCourseID = ?";
            var sql = "Select  EducationCourseID, CourseName, CourseDate ,ClosingDate ,Description, Address, Price from EducationCourse where EducationCourseID = ?";
            connection.query(sql, [id], async function (err, result, fields) {
                if (err) {
                    console.log('myevents', err.message)
                    return res.status(400).send({ 'message': err.message });
                };
                console.log("fetch successful");

                if (result != [] && result != "" && result != null) {
                    let [rows, fields_1] = await conn.execute(sql_1, [id]);
                    if (rows != [] && rows != "" && rows != null) {
                        for (j = 0; j < rows.length; j++) {
                            images.push(rows[j].Location);
                        }
                        response = {
                            _id: result[0].EducationCourseID,
                            courseName: result[0].CourseName,
                            dateFrom: result[0].CourseDate,
                            dateTo: result[0].ClosingDate,
                            address: result[0].Address,
                            description: result[0].Description,
                            price: result[0].Price,
                            image: images
                        }
                    }

                    else {
                        response = {
                            _id: result[0].EducationCourseID,
                            courseName: result[0].CourseName,
                            dateFrom: result[0].CourseDate,
                            dateTo: result[0].ClosingDate,
                            address: result[0].Address,
                            description: result[0].Description,
                            price: result[0].Price,
                            image: ""
                        }



                    }
                    res.send(response);
                    connection.release();

                }

                else {
                    connection.release();
                    res.send({ 'message': 'event is not available ' });
                }

            });


        });
    }

    catch (err) {
        res.send({ 'message': err.message });
        console.log('myevents', err.message)
    }

});

module.exports = router; 