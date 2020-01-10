const Joi = require('joi');
const mongoose = require('mongoose');

const Booking = mongoose.model('Booking', new mongoose.Schema({
    salonID: {
        type: Number,
        required: true,
        minlength: 1,
        maxlength: 100
    },
    salonid: {
        type: Number,
        required: true,
        minlength: 1,
        maxlength: 100
    },
    salonName: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 100
    },
    bookingID: {
        type: String,
        default: null,
        unique: true,
    },
    servicesName: [{
        type: String,
        required: false,
        minlength: 0,
        maxlength: 100
    }],
    dealID : {
        type: Number,
        default: null,
        minlength: 0,
        maxlength: 10
    },
    dealName: {
        type: String,
        required: false,
        minlength: 0,
        maxlength: 100
    },
    locality: {
        type: String,
        required: false,
        minlength: 0,
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
        default: false,
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
    email: {
        type: String,
        required: false,
        minlength: 1,
        maxlength: 25

    },
    StylistID : {
        type: Number,
        default: null,
        minlength: 1,
        maxlength: 10
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

function validateBooking(booking) {
    const schema = {
      fullName: Joi.string(),
      mobileNumber: Joi.string().min(5).max(15).required()
    };
  
    return Joi.validate(booking, schema);
  }

exports.Booking = Booking;
exports.validateBooking = validateBooking;
