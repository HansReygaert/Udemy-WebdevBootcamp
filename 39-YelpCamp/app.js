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
      const campground = await Campground.findById(req.params.id, (err) => {
         if(err) { 
            return next(new ExpressError('Error 404, Page not found', 404));
         }
      });

      const { title } = campground; 
      
      res.render('campgrounds/show', { campground, title: `Yelp-Camp | ${title}` });
}));

app.get('/campgrounds/:id/edit', catchAsync(async (req,res, next) => {
      const campground = await Campground.findById(req.params.id, (err) => {
         if(err) {
            return next(new ExpressError('Error 404, Page not found', 404))
         }
      });
      
      res.render('campgrounds/edit', { 
         campground, title: `Yelp-Camp | Edit Campground` 
      }); 
}));

   //POST ROUTES
app.post('/campgrounds', catchAsync(async (req,res, next) => {
      const campground = new Campground(req.body.campground); 
      await campground.save();
      console.log(`MONGOOSE: Saved following element \n ${campground}`);
      res.redirect(`campgrounds/${campground._id}`);
}));
   //PUT ROUTES
app.put('/campgrounds/:id', catchAsync(async(req, res, next) => {
      const { id } = req.params; 
      const campground = await Campground.findByIdAndUpdate(id, 
       {...req.body.campground});
      console.log(`MONGOOSE: Updated the following element \n ${campground}`);
      res.redirect(`/campgrounds/${campground._id}`);
}));
   //DELETE ROUTES
app.delete('/campgrounds/:id', catchAsync(async(req,res, next) => {
   const { id } = req.params;
   const deletedCampground = await Campground.findByIdAndDelete(id);
   console.log(`MONGOOSE: Deleted the following element 
   \n ${deletedCampground}`);
   res.redirect(`/campgrounds`);
}));

//ERROR code
app.all('*', (req, res, next) => { 
   next(new ExpressError('Page not found', 404));
});

app.use((err, req, res, next) =>{ 
   const {  message = "Something went wrong",
            statusCode  = 500
         } = err;
   
   console.log(`Error ${statusCode}: ${message}`);
   res.status(statusCode).send(message);
   next(err);
});

