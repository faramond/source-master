const Joi = require('joi');
const mongoose = require('mongoose');

const Salary = mongoose.model('Salary', new mongoose.Schema({
    employeeName: {
        type: String,
        default: null,
        minlength: 2,
        maxlength: 50
    },
    employeeSalary: [{
        amount: {type: Number,
                required: false,
                minlength: 1,
                maxlength: 7},
        dateFrom: {type: Date},
        dateTo: {type: Date},
        salarySlip: {type: String}

    }],
 mobileNumber: {
        type: Number,
        unique: true,
        required: false,
        minlength: 5,
        maxlength: 15
    },
    countryCode: {
        type: Number,
        required: true,
        minlength: 2,
        maxlength: 15
    },
    email: {
        type: String,
    },
    profile: {
        type: String,

    }, 
    employee: {

        type: mongoose.Schema.Types.ObjectId,
        ref: 'employee',
        default: null
    },
    created: {
        type: Date, default: Date.now

    },
    updated: {
        type: Date

    }
}));

function validateUser(salary) {
    const schema = {
      fullName: Joi.string(),
      mobileNumber: Joi.string().min(5).max(15).required(),
      countryCode: Joi.string().min(2).max(15).required(),
    };
  
    return Joi.validate(salary, schema);
  }

exports.Salary = Salary;
exports.validateSalary = validateUser;