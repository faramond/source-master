const Joi = require('joi');
const mongoose = require('mongoose');

const ProductSales = mongoose.model('ProductSales', new mongoose.Schema({
  productSalesID: {
    type: String,
    unique: true,
    default: null
},
date: {
    type: Date,
    required: true
},
amount: {
    type: Number,
    required: true,
    minlength: 1,
    maxlength: 15
},
description: {
    type: String,
    minlength: 10,
    maxlength: 100

}

}));


exports.ProductSales = ProductSales;
