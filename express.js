
var bodyParser = require('body-parser');
var express = require("express");
var app = express();
var MongoClient = require('mongodb').MongoClient;
var bcrypt = require('bcrypt');
const saltRounds = 10;

app.use(bodyParser.json({ type: 'application/json' }));
app.use(bodyParser.urlencoded({ extended: true }));

var db;

MongoClient.connect("mongodb://localhost:27017/moby", (err, client) => {
    if (err) return console.log(err)
    db = client.db("moby") // whatever your database name is
    app.listen(8080, () => {
        console.log("listening on 8080")
    })
})

app.post("/signInData", (req, res) => {
    db.collection("users").find({ username: req.body.username }).toArray((err, user) => {
        
        if (!user.length) {
            res.json("Login unsuccessfull, dip-shit.");
        } else if (err) {
            res.json("Login unsuccessfull, dip-shit.");
        } 

        bcrypt.compare(req.body.password, user[0].password, function(err, resolve) {
            //res == true
            console.log(resolve)
         if (resolve === true) {
            res.json(`Login successful!`);
            console.log("Log in success")
        } else {
            console.log('You fucked up.')
            res.json("Login unsuccessfull, dip-shit.");
        }
        });
    })
});
    app.post('/signUpData', (req, res) => {
    if (req.body.username.length && req.body.password.length) {
        db.collection('users').find({ username: req.body.username }).toArray((err, dataMatch) => {
            if (!dataMatch.length) {
                bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
                    // Store hash in your password DB.
                    db.collection('users').save({username: req.body.username, password: hash}, (err, result) => {
                        if (err) {
                            res.json("Failed")
                            return console.log(err);
                        } else {
                            res.json("Sign Up Successful")
                            console.log('saved to database');
                        }
                    });
                });
            } else {
                res.json('This username already exists...asshole.')
            }
        })
    } else {
        res.json('Error: username or password can\'t be blank, toolbag')
    }
});
