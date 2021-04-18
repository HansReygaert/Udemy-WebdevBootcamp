//Mongoose
const mongoose = require('mongoose'); 
mongoose.connect('mongodb://localhost:27017/yelp-camp', 
{
   useUnifiedTopology: true,
   useCreateIndex: true, 
   useNewUrlParser: true,
   useFindAndModify: false
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
//STATICS ASSETS
app.use(express.static(path.join(__dirname, 'public')));
//EXPRESS-SESSION
   //WARNING, THIS IS NOT PRODUCTION READY
const session = require('express-session'); 
const COOKIE_MAX_AGE = 1000*60*60*24* 7;
const COOKIE_EXPIRES_TIME = Date.now() + COOKIE_MAX_AGE;  
const sessionConfig = {
   secret: "thisisbad",
   resave: false, 
   saveUninitialized: true,
   cookie: {
      httpOnly: true, 
      expires: COOKIE_EXPIRES_TIME,
      maxAge: COOKIE_MAX_AGE
   }
};
   app.use(session(sessionConfig));

      //Logging tool - Morgan
      const morgan = require('morgan');
      // app.use(morgan('combined', {
      //    skip: function (req, res) { return res.statusCode < 400 }
      //  }));

//FLASH 
       //(depends on session)
const flash = require('connect-flash');
app.use(flash());

       //flash middleware
app.use((req,res,next) => { 
   res.locals.success = req.flash('success');
   res.locals.error = req.flash('error'); 
   next();
})
//ROUTES
const campgrounds = require('./routes/campgrounds'); 
const reviews = require('./routes/reviews');

   //MIDDLEWARE
      //Error handling
   const ExpressError = require('./utils/ExpressError');
   const catchAsync = require('./utils/catchAsync');
      //Validate Schema - Requires Joi 
   const { campgroundSchema, reviewSchema } = require('./validation/schemas')
      //EJS MATE
   const ejsMate = require('ejs-mate');
   app.engine('ejs', ejsMate);
      //URL ENCODED
   app.use(express.urlencoded({ extended: true}));
      //METHOD OVERRIDE
   const methodOverride = require('method-override');
   app.use(methodOverride('_method'));

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
   // campground Routes
app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews); 

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

