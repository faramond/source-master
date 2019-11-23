const { PrepaidSales } = require('../models/prepaidSales');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();


router.get('/', async (req, res) => {
    try {
        
        
        const prepaidSales = await PrepaidSales.find()
        .or([{date:{$gte:(req.query.dateFrom),$lte:((req.query.dateTo)+"T23:59:59.000Z")}}])
        
        res.send(prepaidSales);
    }
    
    catch (err) {
        res.send({ 'message': err.message });
        console.log('Prepaid Sales statement', err.message)
    }

});

router.post('/', async (req, res) => {
    try {
        let prepaidSales = await PrepaidSales.find()
        req.body.prepaidSalesID = '#' + (000000 + prepaidSales.length) + 'ds';
        let prepaidSalesData = new PrepaidSales(req.body);
        prepaidSalesData = await prepaidSalesData.save();

        res.send(prepaidSalesData);
    }
    catch (err) {
        res.send({ 'message': err.message });
        console.log('Prepaid Sales Post', err.message)
    }

   }
);

module.exports = router; 