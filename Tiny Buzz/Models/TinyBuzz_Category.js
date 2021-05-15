const Joi = require('joi');
const mongoose = require('mongoose');

const xxTinyBuzz_Category = mongoose.model('xxTinyBuzz_Category', new mongoose.Schema({

    category_name: {
        type: String,
        default: null,
        maxlength: 20
    },
    English: {
        type: String,
        default: null,
        maxlength: 20
    },
    Hindi: {
        type: String,
        default: null,
        maxlength: 20
    },
    Punjabi: {
        type: String,
        default: null,
        maxlength: 20
    },
    created: {
        type: Date,
        default: Date.now
    }

}));


exports.xxTinyBuzz_Category = xxTinyBuzz_Category;
