const { ProductSales } = require('../models/productSales');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();


router.get('/', async (req, res) => {
    try {
        
        
        const productSales = await ProductSales.find()
        .or([{date:{$gte:(req.query.dateFrom),$lte:(req.query.dateTo)}}])
        
        res.send(productSales);
    }
    
    catch (err) {
        res.send({ 'message': err.message });
        console.log('Product Sales statement', err.message)
    }

});

router.post('/', async (req, res) => {
    try {
        let productSales = await ProductSales.find()
        req.body.productSalesID = '#' + (000000 + productSales.length) + 'ds';
        let productSalesData = new ProductSales(req.body);
        productSalesData = await productSalesData.save();

        res.send(productSalesData);
    }
    catch (err) {
        res.send({ 'message': err.message });
        console.log('Product Sales Post', err.message)
    }

   }
);

module.exports = router; 