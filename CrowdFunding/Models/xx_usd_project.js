//const Joi = require("joi");
const mongoose = require("mongoose");

const schema = new mongoose.Schema({
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
  status: {
    type: String,
    default: null,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "xx_usd_user",
    default: null,
  },
  company: {
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
  },
  representative: {
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
  },
  attribute_1: {
    type: String,
    default: null,
  },
  attribute_2: {
    type: String,
    default: null,
  },
  attribute_3: {
    type: String,
    default: null,
  },
  attribute_4: {
    type: String,
    default: null,
  },
  attribute_5: {
    type: String,
    default: null,
  },
  attribute_6: {
    type: String,
    default: null,
  },
  attribute_7: {
    type: String,
    default: null,
  },
  attribute_8: {
    type: String,
    default: null,
  },
  attribute_9: {
    type: String,
    default: null,
  },
  attribute_10: {
    type: String,
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
});

const xx_usd_project = mongoose.model("xx_usd_project", schema);

exports.xx_usd_project = xx_usd_project;
