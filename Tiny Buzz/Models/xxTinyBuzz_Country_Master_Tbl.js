const Joi = require('joi');
const mongoose = require('mongoose');

const xxTinyBuzz_Country_Master_Tbl = mongoose.model('xxTinyBuzz_Country_Master_Tbl', new mongoose.Schema({

    country_name: {
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


exports.xxTinyBuzz_Country_Master_Tbl = xxTinyBuzz_Country_Master_Tbl;
