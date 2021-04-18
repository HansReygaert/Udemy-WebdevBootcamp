//EXPRESS
const express = require('express');
const router = express.Router({mergeParams: true});

//FLASH
const flash = require('connect-flash');

//ERROR HANDLING 
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

//MODEL 
const Campground = require('../models/campground');
const Review = require('../models/review');
   //JOI Validation Schema
const { reviewSchema } = require('../validation/schemas');

//VALIDATION 
 
 const validateReview = (req, res, next ) => {
    const { error } = reviewSchema.validate(req.body);
    if(error){
       const msg = error.details.map( el => el.message).join(', ');
       throw new ExpressError(msg, 400);
    } else { 
       next();
    }
 }
//ROUTES
 //POST
router.post('/', validateReview, catchAsync(async (req,res) => {
    console.log(`Posting data to path: /campgrounds/${req.params.id}/reviews`);
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review); 
    await review.save(); 
    console.log(`MONGOOSE: Saved following element \n ${review}`);
    await campground.save();
    console.log(`MONGOOSE: Saved following element \n ${campground}`);
    req.flash('success', 'successfully added review');
    res.redirect(`/campgrounds/${campground._id}`);
 }));

 //DELETE 
router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'successfully removed review');
    res.redirect(`/campgrounds/${id}`);
 }));
 
 module.exports = router;