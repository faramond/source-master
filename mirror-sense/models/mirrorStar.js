
const Joi = require('joi');
const mongoose = require('mongoose');

const MirrorStar = mongoose.model('MirrorStar', new mongoose.Schema({

    salonID: {
        type: String,
        required: true


    },
    starName: {
        type: String,
        default: null

    },
    bio: {
        type: String,
        default: null

    },
    avgRating: Number ,
    reviews: [{
        reviewer: String,
        review: String,
        image: String,
        rating: String
    }],
    posts: [
        {
            writerName: String,
            content: String,
            created: {
                type: Date, default: Date.now

            },

        }
    ],
    salon: {

        type: mongoose.Schema.Types.ObjectId,
        ref: 'salon',
        default: null
    },

    image: {
        type: String,
        default: null
    },
    coverImage: {
        type: String,
        default: null
    }
}));





exports.MirrorStar = MirrorStar;
//exports.validateEmp = validateEmp;