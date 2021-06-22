//const Joi = require("joi");
const mongoose = require("mongoose");

const xx_cf_project = mongoose.model(
  "xx_cf_project",
  new mongoose.Schema({
    projectName: {
      type: String,
      required: true,
      minlength: 2,
    },
    projectLocation: {
      type: String,
      required: true,
      minlength: 2,
    },
    description: {
      type: String,
      default: null,
    },
    projectNumber: {
      type: String,
      unique: true,
      required: true,
    },
    whyToInvest: {
      type: String,
      default: null,
    },
    maxFundTarget: {
      type: Number,
      required: true,
      minlength: 1,
    },
    minFundTarget: {
      type: Number,
      required: true,
      minlength: 1,
    },
    timePeriod: {
      years: { type: String, required: true },
      months: { type: String, required: true },
      days: { type: String, required: true },
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "approved", "rejected"],
    },
    project_video_url: {
      type: String,
      default: null,
    },
    project_image: {
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
    companyID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "xx_cf_company",
      default: null,
    },
    representativeID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "xx_cf_representative",
      default: null,
    },
    currencyID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "xx_cf_currency",
      default: null,
    },
    approvedDate: {
      type: Date,
      default: null,
    },
    completedDate: {
      type: Date,
      default: null,
    },
    rejectedDate: {
      type: Date,
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

exports.xx_cf_project = xx_cf_project;
