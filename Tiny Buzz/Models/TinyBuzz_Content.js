const Joi = require("joi");
const mongoose = require("mongoose");

const xxTinyBuzz_Content = mongoose.model(
  "xxTinyBuzz_Content",
  new mongoose.Schema({
    count: {
      type: Number,
      auto: true
    },
    news_description: {
      type: String,
      default: null,
    },
    newsID: {
      type: String,
      default: null,
      unique: true,
    },
    creator: {
      type: String,
      default: null,
    },
    news_title: {
      type: String,
      default: null,
    },
    news_source: {
      type: String,
      default: null,
    },
    image_source: {
      type: String,
      default: null,
    },
    news_url: {
      type: String,
      default: null,
    },
    created_by: {
      type: String,
      default: null,
    },
    updated_by: {
      type: String,
      default: null,
    },
    isApproved: {
      type: Boolean,
      default: false
    },
    isBreaking: {
      type: Boolean,
      default: false
    },
    language_ID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "xxTinyBuzz_Language_Master_Tbl",
    },
    country_ID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "xxTinyBuzz_Country_Master_Tbl",
    },
    category_ID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TinyBuzz_Category",
    },
    created: {
      type: Date,
      default: Date.now,
    },
    images: [
      {
        type: String,
      },
    ],
    updated: {
      type: Date,
      default: Date.now,
    },
  })
);

exports.xxTinyBuzz_Content = xxTinyBuzz_Content;
