const Joi = require('joi');
const mongoose = require('mongoose');

const Booking = mongoose.model('Booking', new mongoose.Schema({
    salonName: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 100
    },
    serviceName: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 100
    },
    dealName: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 100
    },
    locality: {
        type: String,
        required: false,
        minlength: 1,
        maxlength: 120
    },
    appointmentDate: {
        type: Date,
        required: false,
    },
    modeOfPayment: {
        type: String,
        required: false,
        minlength: 1,
        maxlength: 10
    },
    amountToPay: {
        type: String,
        required: false,
        minlength: 1,
        maxlength: 8
    },
    status: {
        type: String,
        required: false,
        minlength: 1,
        maxlength: 20
    },
    isServed: {
        type: Boolean,
        required: false,
        default: false

    },
    userName: {
        type: String,
        required: false,
        minlength: 1,
        maxlength: 25
    },
    mobileNumber: {
        type: Number,
        required: false,
        minlength: 1,
        maxlength: 15
    },
    mirrorStar: {
        type: String,
        required: false,
        default: null 
        
    },
     created: {
        type: Date, default: Date.now
    }

}));


exports.Booking = Booking;
