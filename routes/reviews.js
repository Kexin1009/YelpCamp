const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const Review = require('../models/review');

const {reviewSchema} = require('../schemas');
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware');


router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Successfully made a new review');
    res.redirect(`/campgrounds/${campground._id}`);

}))

router.delete('/:reviewID', isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const {id, reviewID} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewID}});
    await Review.findByIdAndDelete(reviewID);
    req.flash('success', 'Successfully deleted a review');
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;