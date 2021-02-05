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
const { error } = require('console');

//EXPRESS
const express = require('express'); 
const app = express(); 
const EXPRESS_PORT_NUMBER = 3000; 
const path = require('path'); 

app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname, 'views'));

   //MIDDLEWARE
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
app.get('/', (req, res) => {
   res.render('home');
});

app.get('/campgrounds', async (req, res) => {
   const campgrounds = await Campground.find({});
   res.render('campgrounds/index', {campgrounds});
});

app.get('/campgrounds/new', (req, res) => {
   res.render('campgrounds/new');
});

app.get('/campgrounds/:id', async (req,res) => {
   const campground = await Campground.findById(req.params.id);
   res.render('campgrounds/show', { campground }); 
});

app.get('/campgrounds/:id/edit', async (req,res) => {
   const campground = await Campground.findById(req.params.id);
   res.render('campgrounds/edit', { campground }); 
});

   //POST ROUTES
app.post('/campgrounds', async (req,res) => {
   const campground = new Campground(req.body.campground); 
   await campground.save();
   console.log(`MONGOOSE: Saved following element \n ${campground}`);
   res.redirect(`campgrounds/${campground._id}`);
});
   //PUT ROUTES
app.put('/campgrounds/:id', async(req, res) => {
   const { id } = req.params; 
   const campground = await Campground.findByIdAndUpdate(id, 
      {...req.body.campground});
   console.log(`MONGOOSE: Updated the following element \n ${campground}`);
   res.redirect(`/campgrounds/${campground._id}`);
});
   //DELETE ROUTES
app.delete('/campgrounds/:id', async(req,res) => {
   const { id } = req.params;
   const deletedCampground = await Campground.findByIdAndDelete(id);
   console.log(`MONGOOSE: Deleted the following element 
   \n ${deletedCampground}`);
   res.redirect(`/campgrounds`);
})

//404 ERROR code
app.use((req, res) => { 
   res.status(404).send('ERROR 404, page not found! ');
})
