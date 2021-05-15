const Joi = require('joi');
const mongoose = require('mongoose');

const xxTinyBuzz_Device_Master_Tbl = mongoose.model('xxTinyBuzz_Device_Master_Tbl', new mongoose.Schema({

    deviceToken: {
        type: String,
        default: null,
        unique: true
    },
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "xxTinyBuzz_Country_Master_Tbl",
    },
    language: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "xxTinyBuzz_Language_Master_Tbl",
    },
    created: {
        type: Date,
        default: Date.now
    }

}));


exports.xxTinyBuzz_Device_Master_Tbl = xxTinyBuzz_Device_Master_Tbl;
