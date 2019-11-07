const Joi = require('joi');
const mongoose = require('mongoose');

const ReviewsAndRatings = mongoose.model('ReviewsAndRatings', new mongoose.Schema({
    avgRating: Number,
    reviews: [{
        reviewer: String,
        review: String,
        image: String,
        rating: String
    }],
}));

// function validateReviewsAndRatings(reviewsAndRatings) {
//     const schema = {
//       fullName: Joi.string(),
//       rating: Joi.string().min(1).max(5).required()

//     };

//     return Joi.validate(reviewsAndRatings, schema);
//   }

exports.ReviewsAndRatings = ReviewsAndRatings;
// exports.validateReviewsAndRatings = validateReviewsAndRatings;