const Joi = require('joi');
const mongoose = require('mongoose');

const LeaveType = mongoose.model('LeaveType', new mongoose.Schema({

    leaveTypeList: [{
        list:{
        type: String,
        required: false,
        minlength: 2,
        maxlength: 50}
    }]
    
    
}));


exports.LeaveType = LeaveType;

