
const mongoose = require('mongoose');

const Domain = mongoose.model('Domain', new mongoose.Schema({
    domainName: {
        type: String,
        required: true,
        unique:true,
      
    },
    price: {
        type: Number,
        required: true
      
    },
    currancy: {
        type: String,
        required: false
      
    },
    isActive: {
        type: Boolean, default:false
       
    },
 email: {
        type: String,
        required: false,
        minlength: 2,
        maxlength: 50
    },
  created: {
        type: Date, default: Date.now

    },
    updated: {
        type: Date

    }
}));

exports.Domain = Domain;