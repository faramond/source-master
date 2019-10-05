
const Joi = require('joi');
const mongoose = require('mongoose');

const WhatHot = mongoose.model('WhatHot', new mongoose.Schema({

    salonID: {
        type: String,
        required:true

    },
    deals:[
        {
            dealName: String,
            price: Number,
            currency: String
        }
    ],
    salon: {

        type: mongoose.Schema.Types.ObjectId,
        ref: 'salon',
        default: null
    },

    image: {
        type: String,
        default: null
    }
}));





exports.WhatHot = WhatHot;
//exports.validateEmp = validateEmp;