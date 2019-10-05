const Joi = require('joi');
const mongoose = require('mongoose');

const Notification = mongoose.model('Notification', new mongoose.Schema({

    description: {
        type: String,
        default: null,
        minlength: 2,
        maxlength: 50
    },
    created: {
        type: Date, default: Date.now
    }

}));


exports.Notification = Notification;
