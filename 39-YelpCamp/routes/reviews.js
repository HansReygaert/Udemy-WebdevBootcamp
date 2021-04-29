//EXPRESS
const express = require('express');
const router = express.Router({mergeParams: true});

//FLASH
const flash = require('connect-flash');
// CONTROLLERS 
const reviews = require('../controllers/reviews');
//ERROR HANDLING 
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

//MODEL 
const { validateReview, isLoggedIn } = require('../middleware');

router.post('/', validateReview, isLoggedIn, catchAsync(reviews.createReview));
router.delete('/:reviewId', isLoggedIn, catchAsync(reviews.deleteReview));
 
 module.exports = router;