const Product = require('./models/product');

// MONGOOSE -------------------
const MONGOOSE_PORT_NUMBER = 27017; 
const MONGOOSE_LINK = 'mongodb://127.0.0.1:'+ MONGOOSE_PORT_NUMBER + '/farmStand';
const mongoose = require('mongoose');
mongoose.connect(MONGOOSE_LINK,
   { useNewUrlParser: true, useUnifiedTopology: true }
   ).then( () => {
      console.log('Database Connection Open---------------------'); 
   }).catch( err => {
      console.log('Database Connection Closed, Error Found------');
      console.log(err);
   });

   const grapeFruit = new Product({
      name: 'Ruby Grapefruit',
      price: 1.99, 
      category: 'fruit'
   });

const seedProducts = [
   {
      name: 'Fairy Eggplant',
      price: 1.00,
      category: 'vegetable'
   },
   {
      name: 'Organic Goddess Melon',
      price: 4.99,
      category: 'fruit'
   },
   {
      name: 'Organic Mini Seedless Watermelon',
      price: 3.99,
      category: 'fruit'
   },
   {
      name: 'Organic Celery',
      price: 1.50,
      category: 'vegetable'
   },
   {
      name: 'Chocolate Whole Milk',
      price: 2.69,
      category: 'dairy'
   },
   {
      name: 'Banana',
      price: 1.54,
      category: 'fruit'
   },
   {
      name: 'Magic Star Apples',
      price: 1.98,
      category: 'fruit'
   },
   {
      name: 'Fresh Buttermilk',
      price: 2.04,
      category: 'dairy'
   },
   {
      name: 'Irish butter', 
      price: 3.12,
      category: 'dairy'
   }
];

Product.insertMany(seedProducts).then(res => {
   console.log(res);
})
.catch(e => {
   console.log(e);
});