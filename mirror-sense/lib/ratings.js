const express = require('express');
const app = express();
app.use(express.json());

function avgRating(ratings) {
    
    let ratingArray = JSON.stringify(ratings);
    ratingArray = JSON.parse(ratingArray);
    console.log("ratingArray", ratingArray.reviews);
    let avgRating;
    let numberOfReviewer = ratingArray.reviews.length
    let totalRating = 0;
    let numberOfFivies = 0;
    let numberOfFours = 0;
    let numberOfThries = 0;
    let numberOfTwos = 0;
    let numberOfOnes = 0;
    for (let key in ratingArray.reviews) {
        console.log(key);
        totalRating += parseInt(ratingArray.reviews[key].rating);
        if (parseInt(ratingArray.reviews[key].rating) == 5) numberOfFivies += 1;
        if (parseInt(ratingArray.reviews[key].rating) == 4) numberOfFours += 1;
        if (parseInt(ratingArray.reviews[key].rating) == 3) numberOfThries += 1;
        if (parseInt(ratingArray.reviews[key].rating) == 2) numberOfTwos += 1;
        if (parseInt(ratingArray.reviews[key].rating) == 1) numberOfOnes += 1;
    }
    avgRating = (totalRating / numberOfReviewer)
    return {
        "avgRating": avgRating,
        "numberOfReviewer": numberOfReviewer,
        "numberOfFivies": numberOfFivies,
        "numberOfFours": numberOfFours,
        "numberOfThries": numberOfThries,
        "numberOfTwos": numberOfTwos,
        "numberOfOnes": numberOfOnes,
        "reviews": ratingArray.reviews
    }
}



exports.avgRating = avgRating;