const { ServiceSales } = require('../models/serviceSales');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();


router.get('/', async (req, res) => {
    try {
        
        
        const serviceSales = await ServiceSales.find()
        .or([{date:{$gte:(req.query.dateFrom),$lte:(req.query.dateTo)}}])
        
        res.send(serviceSales);
    }
    
    catch (err) {
        res.send({ 'message': err.message });
        console.log('Service Sales statement', err.message)
    }

});

router.post('/', async (req, res) => {
    try {
        let serviceSales = ServiceSales.find()
        req.body.serviceSalesID = '#' + (000000 + serviceSales.length) + 'ds';
        let serviceSalesData = new ServiceSales(req.body);
        serviceSalesData = await serviceSalesData.save();

        res.send(serviceSalesData);
    }
    catch (err) {
        res.send({ 'message': err.message });
        console.log('Service Sales Post', err.message)
    }

   }
);

module.exports = router; 