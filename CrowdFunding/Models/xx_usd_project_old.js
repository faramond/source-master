//const Joi = require("joi");
const mongoose = require("mongoose");

const xx_usd_project = mongoose.model(
  "xx_usd_project",
  new mongoose.Schema({
    projectName: {
      type: String,
      required: true,
      minlength: 2,
    },
    projectLocation: {
      type: String,
      default: null,
      minlength: 2,
    },

    maxFundTarget: {
      type: Number,
      default: null,
      minlength: 1,
    },
    minFundTarget: {
      type: Number,
      default: null,
      minlength: 2,
    },
    timePeriod: {
      type: String,
      default: null,
    },
    businessPlan: {
      type: String,
      default: null,
    },
    presentation: {
      type: String,
      default: null,
    },
    chamberOfCommerceRegistration: {
      type: String,
      default: null,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "xx_usd_company",
      default: null,
    },
    representative: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "xx_usd_representative",
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

exports.xx_usd_project = xx_usd_project;
