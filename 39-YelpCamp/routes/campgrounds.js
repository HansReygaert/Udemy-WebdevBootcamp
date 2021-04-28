//EXPRESS
const express = require('express');
const router = express.Router(); 

//ERROR HANDLING 
const catchAsync = require('../utils/catchAsync');

//MODEL 
const Campground = require('../models/campground');
   //JOI Validation Schema

//MIDDLEWARE
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
//FLASH
const flash = require('connect-flash');

//ROUTES
   //PREFIX
   const pathPrefix = 'campgrounds';

   //GET: 
router.get('/', catchAsync(async (req, res, next) => {
   const campgrounds = await Campground.find({});
   res.render(`${pathPrefix}/index`, { campgrounds });
}));

//campgrounds/new
router.get('/new', isLoggedIn, (req, res) => {
res.render(`${pathPrefix}/new`)
});

//campgrounds/:id
router.get('/:id', catchAsync(async (req,res, next) => {
  const campground = await Campground.findById(req.params.id).populate({
      path: 'reviews',
      populate: {
          path: 'author'
      }
  }).populate('author');
  console.log(campground);
  if (!campground) {
   req.flash('error', 'Cannot find that campground!');
   return res.redirect('/campgrounds');
  }
  res.render('campgrounds/show', { campground });
}));

//campgrounds/:id/edit
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
   const { id } = req.params; 
   const campground = await Campground.findById(id);
   if(!campground){
      req.flash('error', 'cannot find that campground');
      res.redirect('/campgrounds');
   }
      res.render(`${pathPrefix}/edit`, { campground });
}));


   //POST:
router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
   const campground = new Campground(req.body.campground); 
   
   campground.author = req.user._id;
   await campground.save();
   req.flash('succes', 'Successfully made a new campground');
   console.log(`MONGOOSE: Saved following element \n ${campground}`);
   res.redirect(`/${pathPrefix}/${campground._id}`);
}));

   //PUT:
router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(async (req, res) => {
   const { id } = req.params; 
   
   campground = await Campground.findByIdAndUpdate(id, 
    {...req.body.campground});
   console.log(`MONGOOSE: Updated the following element \n ${campground}`);
   req.flash('success', 'Successfully edited a campground');
   res.redirect(`/${pathPrefix}/${campground._id}`);
}));

   //DELETE:
   router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
   const { id } = req.params;
   const deletedCampground = await Campground.findByIdAndDenodelete(id);
   console.log(`MONGOOSE: Deleted the following element 
   \n ${deletedCampground}`);

   req.flash('success', 'Successfully removed the campground');
   res.redirect(`/${pathPrefix}`);
}));



module.exports = router;