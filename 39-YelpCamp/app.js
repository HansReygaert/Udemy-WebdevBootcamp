//Mongoose
const mongoose = require('mongoose'); 
mongoose.connect('mongodb://localhost:27017/yelp-camp', 
{
   useUnifiedTopology: true,
   useCreateIndex: true, 
   useNewUrlParser: true
});

const db = mongoose.connection; 
db.on('error', console.error.bind(console, "Connection error:"));
db.once('open', () => {
   console.log("MONGOOSE: Connection to database established");
});

//MODEL 
const Campground = require('./models/campground');
const Review = require('./models/review');

//EXPRESS
const express = require('express'); 
const app = express(); 
const EXPRESS_PORT_NUMBER = 3000; 
const path = require('path'); 

app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname, 'views'));

   //MIDDLEWARE
      //Error handling
   const ExpressError = require('./utils/ExpressError');
   const catchAsync = require('./utils/catchAsync');
      //Validate Schema - Requires Joi 
   const { campgroundSchema, reviewSchema } = require('./validation/schemas')
      //EJS MATE
   const ejsMate = require('ejs-mate');
   app.engine('ejs', ejsMate);
      //Morgan 
   const morgan = require('morgan');
   app.use(morgan('common'));
      //URL ENCODED
   app.use(express.urlencoded({ extended: true}));
      //METHOD OVERRIDE
   const methodOverride = require('method-override');
   app.use(methodOverride('_method'));
   //STATICS ASSETS
   app.use(express.static(path.join(__dirname, 'public')));

//EXPRESS LISTEN AND 404
app.listen(EXPRESS_PORT_NUMBER, ()=> { 
   console.log(`EXPRESS: Listening to port ${EXPRESS_PORT_NUMBER}`);  
}).on('error', console.error.bind(console, 'EXPRESS: Error'));

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
      //GET ROUTES
app.get('/',  (req, res) => {
   res.render('home', { title: 'Yelp-Camp | HOME'});
});

app.get('/campgrounds', catchAsync(async (req, res, next) => {
      const campgrounds = await Campground.find({});
      res.render('campgrounds/index', 
      { campgrounds, title: 'Yelp-Camp | Campgrounds'});
}));

app.get('/campgrounds/new', (req, res, next) => {
   res.render('campgrounds/new', {title: 'Yelp-Camp | New Campground'});
});

app.get('/campgrounds/:id', catchAsync(async (req,res, next) => {
   const campground = await Campground.findById(req.params.id).populate('reviews');
      const { title } = campground; 
      
      res.render('campgrounds/show', { campground, title: `Yelp-Camp | ${title}` });
}));

app.get('/campgrounds/:id/edit', catchAsync(async (req,res, next) => {
      const campground = await Campground.findById(req.params.id, (err) => {
         if(err){
            return next(new ExpressError('Campground not found', 404));
         }
      });
   }));

   //POST ROUTES
app.post('/campgrounds', validateCampground, catchAsync(async (req,res, next) => {
      const campground = new Campground(req.body.campground); 
      await campground.save();
      console.log(`MONGOOSE: Saved following element \n ${campground}`);
      res.redirect(`campgrounds/${campground._id}`);
}));

app.post('/campgrounds/:id/reviews', validateReview, catchAsync(async (req,res) => {
   console.log(`Posting data to path: /campgrounds/${req.params.id}/reviews`);
   const campground = await Campground.findById(req.params.id);
   const review = new Review(req.body.review);
   campground.reviews.push(review); 
   await review.save(); 
   console.log(`MONGOOSE: Saved following element \n ${review}`);
   await campground.save();
   console.log(`MONGOOSE: Saved following element \n ${campground}`);
   res.redirect(`/campgrounds/${campground._id}`);
}));

   //PUT ROUTES
app.put('/campgrounds/:id', validateCampground, catchAsync(async(req, res, next) => {
      const { id } = req.params; 
      const campground = await Campground.findByIdAndUpdate(id, 
       {...req.body.campground});
      console.log(`MONGOOSE: Updated the following element \n ${campground}`);
      res.redirect(`/campgrounds/${campground._id}`);
}));
//DELETE ROUTES
app.delete('/campgrounds/:id/reviews/:reviewId', catchAsync(async (req, res) => {
   const { id, reviewId } = req.params;
   await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
   await Review.findByIdAndDelete(reviewId);
   res.redirect(`/campgrounds/${id}`);
}))

app.delete('/campgrounds/:id', catchAsync(async(req,res, next) => {
   const { id } = req.params;
   const deletedCampground = await Campground.findByIdAndDelete(id);
   console.log(`MONGOOSE: Deleted the following element 
   \n ${deletedCampground}`);
   res.redirect(`/campgrounds`);
}));

//ERROR code
app.all('*', (req, res, next) => {
   const Error404 = new ExpressError('Page not found', 404); 
   console.log('ERROR: NO ROUTE FOUND, SENDING ERROR TO MIDDLEWARE');
   next(Error404);
});

//Catch-all for all errors
app.use((err, req, res, next) => { 
   const title = "YelpCamp | Error";

   const {  message = "Internal Server Error",
            statusCode  = 500
         } = err;
         
   res.status(statusCode).render('error', { err, title });
   next(err);
});

