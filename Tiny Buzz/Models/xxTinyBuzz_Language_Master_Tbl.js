const Joi = require('joi');
const mongoose = require('mongoose');

const xxTinyBuzz_Language_Master_Tbl = mongoose.model('xxTinyBuzz_Language_Master_Tbl', new mongoose.Schema({

    language_name: {
        type: String,
        default: null,
        maxlength: 20
    },
    language: {
        type: String,
        default: null,
        maxlength: 20
    },
    active: {
        type: Boolean,
        default: null,
    },
    created: {
        type: Date,
        default: Date.now
    }

}));


exports.xxTinyBuzz_Language_Master_Tbl = xxTinyBuzz_Language_Master_Tbl;
