// MONGOOSE -------------------

const MONGOOSE_PORT_NUMBER = 27017; 
const MONGOOSE_LINK = 'mongodb://localhost:'+ MONGOOSE_PORT_NUMBER + '/farmStand';
const mongoose = require('mongoose');
mongoose.connect(MONGOOSE_LINK
   , { useNewUrlParser: true, useUnifiedTopology: true }
   ).then( () => {
      console.log('Database Connection Open'); 
   }).catch( err => {
      console.log('Database Connection Closed, Error Found');
      console.log(err);
   });
// EXPRESS -------------------

const express =  require('express');
const app = express(); 
const path = require('path');
const NODE_PORT_NUMBER = 3000;  

app.set('views', path.join(__dirname, 'views')); 
app.set('view engine', 'ejs'); 

app.listen(NODE_PORT_NUMBER, ()=> {
   console.log(`Node is live on port ${NODE_PORT_NUMBER}`);
});


// Models-------------------------------------
const Product = require('./models/product');

// ROUTES ------------------------------------
app.get('/products', async (req, res) => {
   const products = await Product.find();
   res.render('./products/index', { products });
});

app.get('/products/:id', async (req,res) => {
   const { id } = req.params; 
   const product = await Product.findById(id); 
   console.log(product); 
   res.render('products/show', { product });
})

