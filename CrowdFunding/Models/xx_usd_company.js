//const Joi = require("joi");
const mongoose = require("mongoose");

const xx_usd_company = mongoose.model(
  "xx_usd_company",
  new mongoose.Schema({
    companyName: {
      type: String,
      default: null,
      minlength: 2,
    },
    legalEntityType: {
      type: String,
      default: null,
      minlength: 2,
    },

    VATNumber: {
      type: String,
      default: null,
      minlength: 1,
    },
    investmentSector: {
      type: String,
      default: null,
      minlength: 2,
    },
    website: {
      type: String,
      default: null,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "xx_usd_user",
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

exports.xx_usd_company = xx_usd_company;
