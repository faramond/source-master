const Joi = require('joi');
const mongoose = require('mongoose');

const Customer = mongoose.model('Customer', new mongoose.Schema({
    challenge: {
        type: Number,
        required: true,
        minlength: 1,
        maxlength: 4
    },
    fullName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },
    userName: {
        type: String,
        unique:true,
        required: true,
        minlength: 2,
        maxlength: 50
    },

    mobileNumber: {
        type: Number,
        unique:true,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    password: {
        type: String,
        required: false,
        minlength: 2,
        maxlength: 50
    },
    email: {
        type: String,
        required: false,
        minlength: 2,
        maxlength: 50
    },
    dob: {
        type: Date

    },
    gender: {
        type: String,
        required: false,
        minlength: 1,
        maxlength: 8
    },
    profile: {
        type: String,

    },
    created: {
        type: Date, default: Date.now

    },
    updated: {
        type: Date

    }
}));


exports.Customer = Customer;