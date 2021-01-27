const express = require("express");
const app = express();
let requestCounter = 0; 

app.listen(3000, () => {
   console.log("Listening to port 3000!");
});

// app.use((req, res) => {
//    requestCounter++; 
//    console.log(`Requests today: ${requestCounter}`);
//    res.send(`Requests made so far: ${requestCounter}`)
// })

// /cats => 'meow'
// /dogs => 'woof'

app.get("/", (req, res) => { 
   res.send('This is the homepage'); 
})

app.get('/r/:subReddit', (req,res) => { 
   const { subReddit } = req.params; 
   res.send(`<h1>Browsing the ${subReddit} page`);
});

app.get('/r/:subReddit/:postId', (req,res) => { 
   const { subReddit, postId } = req.params; 
   res.send(`<h1>Viewing postID: ${postId} on the ${subReddit}`);
})

app.get('/search', (req,res) => {
   const { q } = req.query; 
   res.send(`<h1>Search results for: ${q} </html>`); 
});

app.get('/cats', (req, res) => {
   res.send('MEOW!!'); 
});

app.post('/cats', (req, res) => { 
   res.send("This is a post to /cats!!! This is very different"); 
})

app.get('/dogs', (req, res) => {
   res.send("WOOF!!");
})