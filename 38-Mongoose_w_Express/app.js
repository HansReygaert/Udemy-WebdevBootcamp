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
app.use(express.urlencoded({extended: true}));

app.listen(NODE_PORT_NUMBER, ()=> {
   console.log(`Node is live on port ${NODE_PORT_NUMBER}`);
});

//Method Override----------------------------
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

// Models-------------------------------------
const Product = require('./models/product');
const categories = [ 
   'fruit', 'vegetable', 'dairy'
];
const e = require('express');

// ROUTES ------------------------------------

app.get('/products', async (req, res) => {
   const products = await Product.find();
   res.render('./products/index', { products });
   console.log('rendering products/');
});

app.get('/products/new/', (req, res) => { 
   res.render('products/new', { categories });
   console.log('rendering products/new');
});

app.get('/products/:id', async (req,res) => {
   const { id } = req.params; 
   const product = await Product.findById(id); 
   res.render('products/show', { product });
   console.log('rendering products/show');
});



app.post('/products', async (req, res) => {
      console.log(`Posting POST data to /products/: \n ${req.body}`);

   const newProduct = new Product(req.body); 
   await newProduct.save();
   res.redirect(`/products/${newProduct._id}`);
});

app.get('/products/:id/edit', async (req,res) => {
   const { id } = req.params; 
   const product = await Product.findById(id);  
   res.render('products/edit', { product, categories });
   console.log('rendering products/show/edit');
});

app.put('/products/:id', async (req, res) => {
   console.log('PUT the update to the database');
   const { id } = req.params; 
   const product = await Product.findByIdAndUpdate(id, 
      req.body, {runValidators: true, new: true});

   res.redirect(`/products/${product._id}`);
});

app.delete('/products/:id', async (req, res) => {   
   const { id } = req.params;
   await Product.findByIdAndDelete(id);
   console.log(`Removing product with id: ${id}`);
   res.redirect('/products');
   console.log('Redirecting to /products/');
});