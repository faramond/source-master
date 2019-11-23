const { CourseSales } = require('../models/courseSales');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();


router.get('/', async (req, res) => {
    try {
        
        
        const courseSales = await CourseSales.find()
        .or([{date:{$gte:(req.query.dateFrom),$lte:((req.query.dateTo)+"T23:59:59.000Z")}}])
        
        res.send(courseSales);
    }
    
    catch (err) {
        res.send({ 'message': err.message });
        console.log('Course Sales statement', err.message)
    }

});

router.post('/', async (req, res) => {
    try {
        let courseSales = await CourseSales.find()
        req.body.courseSalesID = '#' + (000000 + courseSales.length) + 'ds';
        let courseSalesData = new CourseSales(req.body);
        courseSalesData = await courseSalesData.save();

        res.send(courseSalesData);
    }
    catch (err) {
        res.send({ 'message': err.message });
        console.log('Course Sales Post', err.message)
    }

   }
);

module.exports = router; 