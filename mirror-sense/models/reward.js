
const Joi = require('joi');
const mongoose = require('mongoose');

const Rewards = mongoose.model('Rewards', new mongoose.Schema({

    points: {
        type: Number,
        default: null
    },
    mobile: {

        type: Number,
        default: null
    },
    calculated: Number,
    calculated1: Number,
    calculated3: Number,
    calculated4: Number,
    cusomter: {

        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        default: null
    },
    employee: {

        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        default: null
    },
    image: {
        type: String,
        default: null
    }
}));

exports.Rewards = Rewards;
//exports.validateEmp = validateEmp;