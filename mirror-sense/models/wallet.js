

const Joi = require('joi');
const mongoose = require('mongoose');

const Wallet = mongoose.model('Wallet', new mongoose.Schema({
    mobile: {

        type: Number,
        unique:true,
        default: null
    },
    totalBalance: {
        type: Number, default: 0
    },
    addBalance: { type: Number, default: 0 },
    oldBalance1: { type: Number, default: 0 },
    calculated2: { type: Number, default: 0 },
    calculated3: { type: Number, default: 0 },
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





exports.Wallet = Wallet;
//exports.validateEmp = validateEmp;