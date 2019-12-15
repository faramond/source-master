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
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 15
    },
    leaveDetails: [{
        leaveType: {
            type: String,
            required: false,
            minlength: 2,
            maxlength: 50
        },
        subject: {
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
        created: {
            type: Date, default: Date.now
        }

    }],
    email: {
        type: String,
        unique:true,
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
