const Joi = require('joi');
const mongoose = require('mongoose');

const Events = mongoose.model('Events', new mongoose.Schema({
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
venue: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 100
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


function validateEvents(events) {
    const schema = {
      fullName: Joi.string()
    };
  
    return Joi.validate(events, schema);
  }

  exports.Events = Events;
exports.validateEvents = validateEvents; 