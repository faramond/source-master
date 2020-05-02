const Joi = require('joi');
const mongoose = require('mongoose');
const Setting = mongoose.model('Setting', new mongoose.Schema({

    termsAndConditions: {
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
    FAQ: [{
        Question: {type: String},
        Answer: {type: String}
    }],
    created: {
        type: Date, default: Date.now
    }
    
}));

exports.Setting = Setting;
