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

app.use(express.urlencoded({ extended: true}));

app.listen(EXPRESS_PORT_NUMBER, ()=> { 
   console.log(`EXPRESS: Listening to port ${EXPRESS_PORT_NUMBER}`);  
}).on('error', console.error.bind(console, 'EXPRESS: Error'));

//MODEL 
const Campground = require('./models/campground');
const { error } = require('console');

//ROUTES
      //GET ROUTES
app.get('/', (req, res) => {
   res.render('home');
   console.log('EXPRESS: rendering home');
});

app.get('/campgrounds', async (req, res) => {
   const campgrounds = await Campground.find({});
   res.render('campgrounds/index', {campgrounds});
   console.log('EXPRESS: rendering index');
});

app.get('/campgrounds/new', (req, res) => {
   res.render('campgrounds/new');
   console.log('EXPRESS: rendering new');
});

app.get('/campgrounds/:id', async (req,res) => {
   const campground = await Campground.findById(req.params.id);
   res.render('campgrounds/show', { campground }); 
   console.log('EXPRESS: rendering show');
});

   //POST ROUTES
app.post('/campgrounds', async (req,res) => {
   const campground = new Campground(req.body.campground); 
   await campground.save();
   res.redirect(`campgrounds/show/${campground._id}`);
   console.log(`EXPRESS: redirecting to /show/${campground._id}`);
});