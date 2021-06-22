const jwt = require("jsonwebtoken");
const config = require("config");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  lastName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  countryCode: {
    type: String,
    unique: true,
    required: true,
    minlength: 2,
    maxlength: 5,
  },
  mobileNumber: {
    type: Number,
    unique: true,
    required: true,
    minlength: 5,
    maxlength: 15,
  },
  password: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  dob: {
    type: Date,
    default: null,
  },
  gender: {
    type: String,
    default: null,
  },
  image: {
    type: String,
    default: null,
  },
  address: {
    type: String,
    default: null,
  },
  roleID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "xx_cf_role",
    default: null,
  },
  status: {
    type: String,
    required: true,
    enum: ["active", "inactive"],
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
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.cf_jwtPrivateKey);
  return token;
};

const xx_cf_user = mongoose.model("xx_cf_user", userSchema);

exports.xx_cf_user = xx_cf_user;
