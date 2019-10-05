
const Joi = require('joi');
const mongoose = require('mongoose');

const Company = mongoose.model('Company', new mongoose.Schema({

    companyName: {
        type: String,
        default: null

    },
    FnB: {
        type: String,
        default: null

    },

    status: {
        type: String,
        default: null

    },
    proRank: {
        type: String,
        default: null

    },
    showAppointment:
    {
        type: String,
        default: null

    },
    logo: {
        type: String,
        default: null

    },
    description: {
        type: String,
        default: null

    },
    image: {
        type: String,
        default: null
    }
}));

async function createCompany(Company) {
    try {
        const company = new Company(Company);
        const result = await company.save();
        console.log('company: ', result);
        return result;
    }
    catch (err) {
        return err.message;
    }
}



exports.Company = Company;
//exports.validateEmp = validateEmp;