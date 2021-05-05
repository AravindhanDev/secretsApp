//jshint esversion:6

require("dotenv").config(); //make sure it places right at the top
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
// const encrypt = require("mongoose-encryption");
const md5 = require("md5");

const app = express();

console.log(md5("123456"));

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const userSchema = new mongoose.Schema ({
  email: String,
  password: String
});

// userSchema.plugin(encrypt, {secret: hashPass, encryptedFields: ['password']}); //Level 2 authentication



const User = new mongoose.model("User", userSchema);



app.get('/', function(req, res) {
  res.render('home');
});

app.get('/login', function(req, res) {
  res.render('login');
});

app.get('/register', function(req, res) {
  res.render('register');
});

app.post('/register', function(req, res) {
  const newUser = new User({
    email: req.body.username,
    password: md5(req.body.password)
  });

  newUser.save(function(err) {  //mongoose encrypt when save
    if (!err) {
      res.render("secrets")
    } else {
      console.log(err);
    }
  });
});


app.post('/login', function(req, res) {
  const username = req.body.username;
  const password = md5(req.body.password);

  User.findOne({  //mongoose decrypt
    email: username
  }, function(err, foundUser) {
    if (!err) {
      if (foundUser) {
        if (foundUser.password === password) {
          res.render("secrets");
        }
      }
    } else {
      res.send(err);
    }
  })

});

app.listen(3000, function() {
  console.log("server started on port 3000!");
})
