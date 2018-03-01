
var bodyParser = require('body-parser');
var express = require("express");
var app = express();
var MongoClient = require('mongodb').MongoClient;

app.use(bodyParser.json({type:'application/json'}));
app.use(bodyParser.urlencoded({extended:true}));
var db;

MongoClient.connect("mongodb://localhost:27017/moby", (err, client) => {
  if (err) return console.log(err)
  db = client.db("moby") // whatever your database name is
  app.listen(8080, () => {
    console.log("listening on 8080")
  })
})

app.post("/signInData", (req, res)=>{
   db.collection("users").find({username: req.body.username}).toArray((err, user)=>{
        if (user[0].password === req.body.password){
            res.json(`Login successful!`); 
            console.log("Log in sucess")
        } else if (err){
            res.json("Login unsuccessfull, dip-shit.");
        } else if (!user.length){
            res.json("Login unsuccessfull, dip-shit.");
        } else {
            console.log('You fucked up.')
            res.json("Login unsuccessfull, dip-shit.");
        }
    })
});

app.post('/signUpData', (req, res) => {
    db.collection('users').save(req.body, (err, result) => {
      if (err) return console.log(err);
      console.log('saved to database');
    });
  });

app.get("/testing", (req,res)=>{
   res.sendfile('testing.html');
});