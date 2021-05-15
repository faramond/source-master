//const Joi = require("joi");
const mongoose = require("mongoose");

const xx_usd_representative = mongoose.model(
  "xx_usd_representative",
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
    mobileNumber: {
      type: Number,
      default: null,
      minlength: 5,
    },
    company: {
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

exports.xx_usd_representative = xx_usd_representative;
