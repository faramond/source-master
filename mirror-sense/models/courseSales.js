const Joi = require('joi');
const mongoose = require('mongoose');

const CourseSales = mongoose.model('CourseSales', new mongoose.Schema({
  courseSalesID: {
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


exports.CourseSales = CourseSales;
