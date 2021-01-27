const express = require('express');
const app = express(); 
const portNumber = 3000;
const path = require('path');

app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname, '/views')); 

app.get(`/`, (req, res) => { 
   res.render('home'); 
}); 

app.get('/cats', (req, res) => {
   const { params } = req.params;
   const cats = ['Blue','Rocket','Monty','Stephanie', 'Winston'];

   res.render('cats', {cats});
});

app.get('/r/:subreddit', (req, res) => { 
   const {subreddit} = req.params; 
   res.render('subreddit', {subreddit});
});

app.get(`/random`, (req, res) => { 
   const randomNumber = Math.floor(Math.random() * 10) + 1; 
   res.render('random', { random: randomNumber});
});

app.listen(portNumber, () => { 
   console.log(`Node Running - Listening on port ${portNumber}`); 
});