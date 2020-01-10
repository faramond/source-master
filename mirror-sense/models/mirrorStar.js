
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
    avgRating: Number,
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

    employee: {

        type: mongoose.Schema.Types.ObjectId,
        ref: 'employee',
        default: null
    },
    StylistID : {
        type: Number,
        default: null,
        minlength: 1,
        maxlength: 10
    },
    followers: [{
        name: String,
        image: String
    }],
    courses: [{
        type: String
    }],
    events: [{
        type: String
    }],
    image: {
        type: String,
        default: null
    },
    coverImage: {
        type: String,
        default: null
    },
    likes: [{
        image: {type: String},
        name: {type: String,
          default: null,
          minlength: 2,
          maxlength: 50},
          customer:{type: String,
              default: null,
              minlength: 2,
              maxlength: 50}

  }],
  likeCounter: {type: Number,
                 default: 0
              }
}));





exports.MirrorStar = MirrorStar;
//exports.validateEmp = validateEmp;