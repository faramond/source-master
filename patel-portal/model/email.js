
const mongoose = require('mongoose');

const Email = mongoose.model('Email', new mongoose.Schema({
    domainName: {
        type: string,
        required: true,
        unique:true,
      
    },
    price: {
        type: string,
        required: true
      
    },
    isActive: {
        type: boolean, default:false
       
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


exports.Email = Email;