const mongoose = require("mongoose");

const xx_cf_currency = mongoose.model(
  "xx_cf_currency",
  new mongoose.Schema({
    currency: {
      type: String,
      default: null,
      minlength: 2,
    },
    ISO4217Code: {
      type: String,
      default: null,
      minlength: 1,
    },
    currencySign: {
      type: String,
      default: null,
      minlength: 1,
    },
    isActive: {
      type: Boolean,
      default: true,
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

exports.xx_cf_currency = xx_cf_currency;
