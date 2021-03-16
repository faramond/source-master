
const Joi = require('joi');
const mongoose = require('mongoose');

const Payment = mongoose.model('Payment', new mongoose.Schema({

    amount: {
        type: Number,
        default: null
    },
    customerName: {
        type: String,
        default: null
    },
    employeeName: {
        type: String,
        default: null
    },
    services: [{
        type: String,
        minlength: 0,
        maxlength: 100
    }],
    dealID: {
        type: Number,
        default: null,
        minlength: 0,
        maxlength: 10
    },
    dealName: {
        type: String,
        required: false,
        minlength: 0,
        maxlength: 100
    },
    educationCourseID: {
        type: Number,
        default: null,
        minlength: 0,
        maxlength: 10
    },
    app_code: {
        type: Number,
        default: null
    },
    txn_ID: {
        type: Number,
        default: null
    },

    pInstruction: {
        type: String,
        default: null
    },
    msgType: {
        type: String,
        default: null
    },
    status: {
        type: String,
        default: null
    },
    order_id: {
        type: String,
        default: null
    },
    channel: {
        type: String,
        default: null
    },
    chksum: {
        type: String,
        default: null
    },

    mobile: {

        type: Number,
        default: null
    },
    customer: {

        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        default: null
    },
    booking: {

        type: mongoose.Schema.Types.ObjectId,
        ref: 'booking',
        default: null
    },
    employee: {

        type: String,
        default: null
    },
    mirrorstar: {

        type: String,
        default: null
    },
    salonID: {
        type: Number,
        default: null
    },
    branchID: {
        type: Number,
        default: null
    },
    StylistID: {
        type: Number,
        default: null,
        minlength: 1,
        maxlength: 10
    },
    wallet: {
        type: Boolean
    },
    created: {

        type: Date, default: Date.now
    },

}));


exports.Payment = Payment;
//exports.validateEmp = validateEmp;
