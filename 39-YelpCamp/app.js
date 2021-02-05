//Method-Override
const methodOverride = require('method-override');

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

//EXPRESS
const express = require('express'); 
const app = express(); 
const EXPRESS_PORT_NUMBER = 3000; 
const path = require('path'); 

app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname, 'views'));

   //MIDDLEWARE
app.use(express.urlencoded({ extended: true}));
app.use(methodOverride('_method'));
   //STATICS
app.use(express.static(path.join(__dirname, 'public')));

app.listen(EXPRESS_PORT_NUMBER, ()=> { 
   console.log(`EXPRESS: Listening to port ${EXPRESS_PORT_NUMBER}`);  
}).on('error', console.error.bind(console, 'EXPRESS: Error'));

//MODEL 
const Campground = require('./models/campground');
const { error } = require('console');

//ROUTES
      //GET ROUTES
app.get('/', (req, res) => {
   console.log('EXPRESS: GET /');
   res.render('home');
});

app.get('/campgrounds', async (req, res) => {
   console.log('EXPRESS: GET /campgrounds');
   const campgrounds = await Campground.find({});
   res.render('campgrounds/index', {campgrounds});
});

app.get('/campgrounds/new', (req, res) => {
   console.log('EXPRESS: GET /campgrounds/new');
   res.render('campgrounds/new');
});

app.get('/campgrounds/:id', async (req,res) => {
   console.log(`EXPRESS: GET - /campgrounds/:id`); 
   const campground = await Campground.findById(req.params.id);
   res.render('campgrounds/show', { campground }); 
});

app.get('/campgrounds/:id/edit', async (req,res) => {
   console.log(`EXPRESS: GET - /campgrounds/:id/edit`);
   const campground = await Campground.findById(req.params.id);
   res.render('campgrounds/edit', { campground }); 
});

   //POST ROUTES
app.post('/campgrounds', async (req,res) => {
   console.log(`EXPRESS: POST - /campgrounds`);
   const campground = new Campground(req.body.campground); 
   console.log(campground);
   await campground.save();
   console.log(`MONGOOSE: Saved following element \n ${campground}`);
   res.redirect(`campgrounds/${campground._id}`);
   console.log(`EXPRESS: Redirecting to /campgrounds/${campground._id}`);
});
   //PUT ROUTES
app.put('/campgrounds/:id', async(req, res) => {
   console.log(`EXPRESS: PUT - /campgrounds/:id`);
   const { id } = req.params; 
   const campground = await Campground.findByIdAndUpdate(id, 
      {...req.body.campground});
   console.log(`MONGOOSE: Updated the following element \n ${campground}`);
   res.redirect(`/campgrounds/${campground._id}`);
   console.log(`EXPRESS: Redirecting to /campgrounds/${campground._id}`);
});
   //DELETE ROUTES
app.delete('/campgrounds/:id', async(req,res) => {
   console.log(`EXPRESS: DELETE - /campgrounds/:id`);
   const { id } = req.params;
   const deletedCampground = await Campground.findByIdAndDelete(id);
   console.log(`MONGOOSE: Deleted the following element 
   \n ${deletedCampground}`);
   res.redirect(`/campgrounds`);
})