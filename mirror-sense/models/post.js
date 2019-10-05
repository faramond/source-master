const Joi = require('joi');
const mongoose = require('mongoose');

const Post = mongoose.model('Post', new mongoose.Schema({

    fullName: {
        type: String,
        default: null,
        minlength: 2,
        maxlength: 50
    },
    mobileNumber: {
        type: Number,
        unique:true,
        required: false,
        minlength: 5,
        maxlength: 15
    },
    email: {
        type: String,
        unique:true,
    },
    description: {
        type: String,
        default: null,
        minlength: 10,
        maxlength: 250
    },
    created: {
        type: Date, default: Date.now
    },
    image: {
        type: String 
   },
   photos:[{
       image : String
    }]

}));

function validatePost(post) {
    const schema = {
      fullName: Joi.string(),
      mobileNumber: Joi.string().min(5).max(15).required(),
      countryCode: Joi.string().min(2).max(15).required()
    };
  
    return Joi.validate(post, schema);
  }

exports.Post = Post;
exports.validatePost = validatePost;