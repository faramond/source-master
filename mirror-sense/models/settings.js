const Joi = require('joi');
const mongoose = require('mongoose');
const Setting = mongoose.model('Setting', new mongoose.Schema({

    tearms: {
        type: String,
        default: null

    },
    aboutUS: {
        type: String,
        default: null

    },

    help: {
        type: String,
        default: null

    },
    privacyPolicy: {
        type: String,
        default: null

    },
    created: {
        type: Date, default: Date.now
    }
    
}));

exports.Setting = Setting;
//exports.validateEmp = validateEmp;