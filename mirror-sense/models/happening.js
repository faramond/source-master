
const Joi = require('joi');
const mongoose = require('mongoose');

const Happening = mongoose.model('Happening', new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 100
    },
    tagLine: {
        type: String,
        required: false,
        minlength: 1,
        maxlength: 150
    },
    date: {
        type: Date,
        required: false,
    },
    description: {
        type: String,
        required: false,
        minlength: 1,
        maxlength: 500
    },
    amount: {
        price: Number,
        currency: String,
    },
    type: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 15
    },
    isActive: {
        type: Boolean,
        default: true
    },
    logo: {
        type: String,
        required: false,
    },
    image: {
        type: String,
        required: false,
        
    },
    
     created: {
        type: Date, default: Date.now
    }

}));


exports.Happening = Happening;
