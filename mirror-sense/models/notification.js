const Joi = require('joi');
const mongoose = require('mongoose');

const Notification = mongoose.model('Notification', new mongoose.Schema({

    employee: {
        type: String,
        default: null
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customer',
        default: null
    },
    data: {
        type: String,
        required: true
    },
    created: {
        type: Date, default: Date.now
    }

}));


exports.Notification = Notification;
