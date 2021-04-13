//EXPRESS
const express = require('express');
const router = express.Router(); 

//ERROR HANDLING 
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

//MODEL 
const Campground = require('../models/campground');
   //JOI Validation Schema
const { campgroundSchema } = require('../validation/schemas')

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
router.get('/new', (req, res, next) => {
res.render(`${pathPrefix}/new`)
});

//campgrounds/:id/edit
router.get('/:id/edit', catchAsync(async (req,res) => {
   const { campground, title } = await Campground.findById(req.params.id);
   const page = title; 
      res.render(`${pathPrefix}/edit`, { campground});
}));
//campgrounds/:id
router.get('/:id', catchAsync(async (req,res, next) => {
const campground = await Campground.findById(req.params.id).populate('reviews');
   const { title } = campground; 
   
   res.render(`${pathPrefix}/show`, { campground });
}));


   //POST:
router.post('/', validateCampground, catchAsync(async (req,res, next) => {
   const campground = new Campground(req.body.campground); 
   await campground.save();
   console.log(`MONGOOSE: Saved following element \n ${campground}`);
   res.redirect(`/${pathPrefix}/${campground._id}`);
}));

   //PUT:
router.put('/:id', validateCampground, catchAsync(async(req, res, next) => {
   const { id } = req.params; 
   const campground = await Campground.findByIdAndUpdate(id, 
    {...req.body.campground});
   console.log(`MONGOOSE: Updated the following element \n ${campground}`);
   res.redirect(`/${pathPrefix}/${campground._id}`);
}));

   //DELETE:
router.delete('/:id', catchAsync(async(req,res, next) => {
   const { id } = req.params;
   const deletedCampground = await Campground.findByIdAndDelete(id);
   console.log(`MONGOOSE: Deleted the following element 
   \n ${deletedCampground}`);
   res.redirect(`/${pathPrefix}`);
}));



module.exports = router;