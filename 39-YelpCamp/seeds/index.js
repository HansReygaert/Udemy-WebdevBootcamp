// THE PURPOSE OF THIS FILE IS TO SEED THE DATABASE 
// THERE IS NO OTHER FUNCTION FOR IT BUT THIS

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
const Campground = require('../models/campground');

   // FOR THE MODEL GENERATION 
   const cities = require('./cities');
   const { places, descriptors} = require('./seedHelpers');

//SEED FUNCTIONS
   //returns random elements from an array
const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async() => {
   await Campground.deleteMany({});
   for(let i = 0; i < 100; i++){
      const random1000 = Math.floor(Math.random() * 1000);
      const camp = new Campground({
         location: `${cities[random1000].city} , ${cities[random1000].state}`,
         title: `${sample(descriptors)} ${sample(places)}`,
         description: '',
         image: 'https://source.unsplash.com/collection/429524'

      });
      await camp.save();
   }
   console.log('Finished seeding the database'); 
}

seedDB().then( () => {
   mongoose.connection.close();
   console.log('Closing the database connection');
});