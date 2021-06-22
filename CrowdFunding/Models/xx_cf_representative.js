//const Joi = require("joi");
const mongoose = require("mongoose");

const xx_cf_representative = mongoose.model(
  "xx_cf_representative",
  new mongoose.Schema({
    firstName: {
      type: String,
      default: null,
      minlength: 2,
    },
    lastname: {
      type: String,
      default: null,
      minlength: 2,
    },
    email: {
      type: String,
      default: null,
      minlength: 1,
    },
    countryCode: {
      type: String,
      unique: true,
      required: true,
      minlength: 2,
      maxlength: 5,
    },
    mobileNumber: {
      type: Number,
      default: null,
      minlength: 5,
      maxlength: 15,
    },
    companyID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "xx_usd_company",
      default: null,
    },
    created: {
      type: Date,
      default: Date.now,
    },
    updated: {
      type: Date,
      default: Date.now,
    },
  })
);

exports.xx_cf_representative = xx_cf_representative;
