
const Joi = require('joi');
const mongoose = require('mongoose');

const Payment = mongoose.model('Payment', new mongoose.Schema({

    amount: {
        type: Number,
        default: null
    },
    customerName: {
        type: String,
        minlength: 1,
        maxlength: 100
    },
    employeeName: {
        type: String,
        minlength: 1,
        maxlength: 100
    },
    services: [{
        type: String,
        required: false,
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
    status_code: {
        type: Number,
        default: null
    },

    status_code: {
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
    mp_secured_verified: {
        type: Boolean,
        default: false
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

        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        default: null
    },
    mirrorstar: {

        type: mongoose.Schema.Types.ObjectId,
        ref: 'mirrorstar',
        default: null
    },
    salonID: {
        type: Number,
        required: true
    },
    branchID: {
        type: Number,
        required: true
    },
    StylistID: {
        type: Number,
        default: null,
        minlength: 1,
        maxlength: 10
    },
    created: {

        type: Date, default: Date.now
    },

}));


exports.Payment = Payment;
//exports.validateEmp = validateEmp;
