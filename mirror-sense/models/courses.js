const Joi = require('joi');
const mongoose = require('mongoose');

const Courses = mongoose.model('Courses', new mongoose.Schema({
  courseName: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 100
},
dateFrom: {
    type: Date,
    required: true,
},
dateTo: {
    type: Date,
    required: true,
},
address: {
    type: String,
    required: false,
    minlength: 1,
    maxlength: 100
},
price: {
    type: String,
    required: false,
    minlength: 1,
    maxlength: 10
},
description: {
    type: String,
    required: false,
    minlength: 1,
    maxlength: 100
},
registeredEmployee: [{
   type: String
}],
image: {
    type: String
}
}));


function validateCourses(courses) {
    const schema = {
      fullName: Joi.string()
    };
  
    return Joi.validate(courses, schema);
  }

  exports.Courses = Courses;
exports.validateCourses = validateCourses;