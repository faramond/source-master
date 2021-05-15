//const Joi = require("joi");
const mongoose = require("mongoose");

const xx_usd_user = mongoose.model(
  "xx_usd_user",
  new mongoose.Schema({
    firstName: {
      type: String,
      default: null,
      minlength: 2,
      maxlength: 50,
    },
    lastName: {
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
    image: {
      type: String,
      default: null,
    },
    address: {
      type: String,
      default: null,
    },
    role: {
      type: String,
    },
    status: {
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

exports.xx_usd_user = xx_usd_user;
