const Joi = require("joi");
const mongoose = require("mongoose");

const creator = mongoose.model("creator", new mongoose.Schema({
  fullName: {
    type: String,
    default: null,
    minlength: 2,
    maxlength: 50,
  },

  mobileNumber: {
    type: String,
    unique: true,
    required: false,
    minlength: 5,
    maxlength: 15,
  },
  countryCode: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 15,
  },
  password: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 255,
  },
  email: {
    type: String,
    unique: true,
  },
  dob: {
    type: Date,
    default: null,
  },
  gender: {
    type: String,
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

exports.creator = creator;
