const Joi = require('joi');
const mongoose = require('mongoose');

const xxTinyBuzz_User = mongoose.model('xxTinyBuzz_User', new mongoose.Schema({

    fullname: {
        type: String,
        default: null,
        maxlength: 20
    },
    password: {
        type: String,
        default: null,
        maxlength: 255
    },
    role: {
        type: String,
        default: null,
        maxlength: 1
    },
    email: {
        type: String,
        unique: true,
    },
    image: {
        type: String,
        default: null,
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date,
        default: Date.now,
    },

}));


exports.xxTinyBuzz_User = xxTinyBuzz_User;
