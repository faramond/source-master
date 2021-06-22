const mongoose = require("mongoose");

const xx_cf_role = mongoose.model(
  "xx_cf_role",
  new mongoose.Schema({
    role: {
      type: String,
      default: null,
      minlength: 2,
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

exports.xx_cf_role = xx_cf_role;
