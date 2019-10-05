const Joi = require('joi');
const mongoose = require('mongoose');

const ReviewsAndRatings = mongoose.model('ReviewsAndRatings', new mongoose.Schema({

    name: {
        type: String,
        default: null,
        minlength: 2,
        maxlength: 50
    },
    description: {
        type: String,
        default: null,
        minlength: 10,
        maxlength: 250
    },
    rating: {
        type: Number,
        default: null,
        minlength: 1,
        maxlength: 5
    },
    image: {
        type: String 
   }
}));

function validateReviewsAndRatings(reviewsAndRatings) {
    const schema = {
      fullName: Joi.string(),
      rating: Joi.string().min(1).max(5).required()

    };
  
    return Joi.validate(reviewsAndRatings, schema);
  }

exports.ReviewsAndRatings = ReviewsAndRatings;
exports.validateReviewsAndRatings = validateReviewsAndRatings;