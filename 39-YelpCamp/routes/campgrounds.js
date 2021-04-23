//EXPRESS
const express = require('express');
const router = express.Router(); 

//ERROR HANDLING 
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

//MODEL 
const Campground = require('../models/campground');
   //JOI Validation Schema
   const { campgroundSchema } = require('../validation/schemas');

//MIDDLEWARE
const { isLoggedIn } = require('../middleware');
//FLASH
const flash = require('connect-flash');

   
//VALIDATION 
const validateCampground = (req, res, next) => {
   const { error } = campgroundSchema.validate(req.body);
   if(error){
      const msg = error.details.map( el => el.message).join(', ');
      throw new ExpressError(msg, 400);
   } else { 
      next();
   }
};

//ROUTES
   //PREFIX
   const pathPrefix = 'campgrounds';

   //GET: 
router.get('/', catchAsync(async (req, res, next) => {
   const campgrounds = await Campground.find({});
   res.render(`${pathPrefix}/index`, 
   { campgrounds, title: 'Yelp-Camp | Campgrounds'});
}));

//campgrounds/new
router.get('/new', isLoggedIn, (req, res) => {
res.render(`${pathPrefix}/new`)
});

//campgrounds/:id
router.get('/:id', catchAsync(async (req,res, next) => {
const campground = await Campground.findById(req.params.id).populate('reviews');   
   if(!campground){
      req.flash('error', 'cannot find that campground');
      res.redirect('/campgrounds');
   }
   res.render(`${pathPrefix}/show`, { campground });
}));

//campgrounds/:id/edit
router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
   const campground = await Campground.findById(req.params.id);
   if(!campground){
      req.flash('error', 'cannot find that campground');
      res.redirect('/campgrounds');
   }
   
    
      res.render(`${pathPrefix}/edit`, { campground });
}));


   //POST:
router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
   const campground = new Campground(req.body.campground); 
   await campground.save();
   req.flash('succes', 'Successfully made a new campground');
   console.log(`MONGOOSE: Saved following element \n ${campground}`);
   res.redirect(`/${pathPrefix}/${campground._id}`);
}));

   //PUT:
router.put('/:id', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
   const { id } = req.params; 
   const campground = await Campground.findByIdAndUpdate(id, 
    {...req.body.campground});
   console.log(`MONGOOSE: Updated the following element \n ${campground}`);
   req.flash('success', 'Successfully edited a campground');
   res.redirect(`/${pathPrefix}/${campground._id}`);
}));

   //DELETE:
   router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
   const { id } = req.params;
   const deletedCampground = await Campground.findByIdAndDelete(id);
   console.log(`MONGOOSE: Deleted the following element 
   \n ${deletedCampground}`);

   req.flash('success', 'Successfully removed the campground');
   res.redirect(`/${pathPrefix}`);
}));



module.exports = router;