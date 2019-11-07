const Joi = require('joi');
const mongoose = require('mongoose');
const { ReviewsAndRatings } = require('../models/reviewsAndRatings')

const Employee = mongoose.model('Employee', new mongoose.Schema({

    fullName: {
        type: String,
        default: null,
        minlength: 2,
        maxlength: 50
    },

    mobileNumber: {
        type: String,
        unique: true,
        required: false,
        minlength: 5,
        maxlength: 15
    },
    countryCode: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 15
    },
    password: {
        type: String,
        required: false,
        minlength: 2,
        maxlength: 255
    },
    email: {
        type: String,
        unique: true,
    },
    dob: {
        type: Date,
        default: null,

    },
    gender: {
        type: String,
       
    },

    profile: {
        type: String,

    },
    created: {
        type: Date, default: Date.now

    },
    updated: {
        type: Date
    },
    dateOfJoining: {
        type: Date

    },
    address: {
        type: String,
        required: false,
        default: null,
        minlength: 1,
        maxlength: 50
    },
    leave: {
        type: Number,
        required: false,
        minlength: 1,
        maxlength: 3
    },
    salonName: {
        type: String,
        default: null,
        minlength: 2,
        maxlength: 50
    },
    salon: {

        type: mongoose.Schema.Types.ObjectId,
        ref: 'salon',
        default: null
    },

    image: {
        type: String
    },
    followers: [{
        name: String,
        image: String
    }],
    bio: String,
    specilality: [String],
    

}));

function validateEmp(employee) {
    const schema = {
        fullName: Joi.string(),
        mobileNumber: Joi.string().min(5).max(15).required(),
        countryCode: Joi.string().min(2).max(15).required(),
        password: Joi.string().min(5).max(255).required(),
       
    };

    return Joi.validate(employee, schema);
}

exports.Employee = Employee;
exports.validateEmp = validateEmp;