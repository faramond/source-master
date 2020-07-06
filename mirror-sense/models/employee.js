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
        required: false,
        minlength: 5,
        maxlength: 15
    },
    Usernm: {
        type: String,
        unique: true,
        required: false,
    },
    countryCode: {
        type: String,
    },
    password: {
        type: String,
        required: false,
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
        type: Date,

    },
    dateReg: {
        type: Date,

    },
    UpdatedOn: {
        type: Date
    },
    dateOfJoining: {
        type: Date

    },
    address: {
        type: String,
        required: false,
        default: null,
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
    salonID: {
        type: Number,
        default: null,
    },
    branchID: {
        type: Number,
        default: null,
    },
    salon: {

        type: mongoose.Schema.Types.ObjectId,
        ref: 'salon',
        default: null
    },
    mirrorstar: {

        type: mongoose.Schema.Types.ObjectId,
        ref: 'mirrorstar',
        default: null
    },
    StylistID: {
        type: Number,
        default: null,
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
    likes: [{
        image: { type: String },
        name: {
            type: String,
            default: null,
            minlength: 2,
            maxlength: 50
        },
        customer: {
            type: String,
            default: null,
            minlength: 2,
            maxlength: 50
        }

    }],
    likeCounter: {
        type: Number,
        default: 0
    }


}));

function validateEmp(employee) {
    const schema = {
        fullName: Joi.string(),
        Usernm: Joi.string().required(),
        countryCode: Joi.string().min(2).max(15).required(),
        password: Joi.string().min(5).max(255).required(),

    };

    return Joi.validate(employee, schema);
}

exports.Employee = Employee;
exports.validateEmp = validateEmp;