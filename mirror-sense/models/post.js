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
        required: false,
        minlength: 5,
        maxlength: 15
    },
    description: {
        type: String,
        default: null,
        maxlength: 400
    },
    likes: [{
        image: { type: String },
        name: {
            type: String,
            default: null,
            minlength: 2,
            maxlength: 50
        },
        mirrorStar: {
            type: String,
            default: null,
            minlength: 2,
            maxlength: 50
        }

    }],
    likeCounter: {
        type: Number,
        default: 0
    },
    comments: [{
        name: {
            type: String,
            default: null,
            minlength: 2,
            maxlength: 50
        },
        comment: {
            type: String,
            default: null,
            minlength: 2,
            maxlength: 50
        },
        mirrorStar: {
            type: String,
            default: null,
            minlength: 2,
            maxlength: 50
        },
        image: { type: String },
        created: {
            type: Date, default: Date.now
        }
    }],
    commentCounter: {
        type: Number,
        default: 0
    },
    employee: {

        type: String,
        default: null
    },
    mirrorstar: {

        type: String,
        default: null
    },
    created: {
        type: Date, default: Date.now
    },
    image: {
        type: String
    },
    photos: [{

        type: String

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