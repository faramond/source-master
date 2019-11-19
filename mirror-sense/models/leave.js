const Joi = require('joi');
const mongoose = require('mongoose');

const Leave = mongoose.model('Leave', new mongoose.Schema({

    fullName: {
        type: String,
        default: null,
        minlength: 2,
        maxlength: 50
    },
   
 mobileNumber: {
        type: Number,
        required: false,
        minlength: 5,
        maxlength: 15
    },
    email: {
        type: String,
        unique:true,
    },
    leaveSubject: {
        type: String,
        required: false,
        minlength: 2,
        maxlength: 50
    },
    description: {
        type: String,
        required: false,
        minlength: 2,
        maxlength: 50
    },
    dateFrom: {
        type: Date
    },
    dateTo: {
        type: Date
    },
    totalLeave: {
        type: Number,
        required: false,
        minlength: 1,
        maxlength: 3
    },
    leaveTaken: {
        type: Number,
        required: false,
        minlength: 1,
        maxlength: 3
    },
    leaveLeft: {
        type: Number,
        required: false,
        minlength: 1,
        maxlength: 3
    },
    appllied: {
        type: Boolean,
        required: false,
        default: false
    },
    created: {
        type: Date, default: Date.now
    }
}));


function validateLeave(leave) {
    const schema = {
      fullName: Joi.string(),
      mobileNumber: Joi.string().min(5).max(15).required(),
      countryCode: Joi.string().min(2).max(15).required()
    };
  
    return Joi.validate(leave, schema);
  }

exports.Leave = Leave;
exports.validateLeave = validateLeave;
