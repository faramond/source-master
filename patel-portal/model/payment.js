
const mongoose = require('mongoose');

const Payment = mongoose.model('Payment', new mongoose.Schema({
    firstName: {
        type: String,
        required: false

    },
    lastName: {
        type: String,
        required: false

    },
    doaminNames: [String],

    mobile: {
        type: Number,
        required: false

    },

    cardNumber: {
        type: String,
        required: true

    },
    nameOnTheCard: {
        type: String,
        required: true

    },

    expire: {
        type: String,
        required: true

    },
    cvv: {
        type: Number,
        required: true

    },
    total: {
        type: String,
        required: true

    },
    currancy: {
        type: String,
        required: false

    },
    email: {
        type: String,
        required: false

    },
    created: {
        type: Date, default: Date.now

    },
    updated: {
        type: Date
    }
}));
exports.Payment = Payment;