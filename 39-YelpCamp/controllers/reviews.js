const Campground = require('../models/campground');
const Review = require('../models/review');

module.exports.createReview = async (req,res) => {
    console.log(`Posting data to path: /campgrounds/${req.params.id}/reviews`);
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review); 
    await review.save(); 
    console.log(`MONGOOSE: Saved following element \n ${review}`);
    await campground.save();
    console.log(`MONGOOSE: Saved following element \n ${campground}`);
    req.flash('success', 'successfully added review');
    res.redirect(`/campgrounds/${campground._id}`);
 };

 module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'successfully removed review');
    res.redirect(`/campgrounds/${id}`);
  };

