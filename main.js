const express = require('express');
const path = require('path');
const mustacheExpress = require('mustache-express');
const app = express();

app.engine('mustache', mustacheExpress());
app.set('views', './views')
app.set('view engine', 'mustache')
app.use(express.static(__dirname + '/public'))


const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient
const url = 'mongodb://localhost:27017/robots';


app.get("/", function(request, respond) {
  MongoClient.connect(url, function(error, db) {
    if (error) {
      throw error;
    } else {
      console.log("Successfully connected to the database");
    }
    const data = require("./data");
    for (var i = 0; i < data.users.length; i++) {
      const user = data.users[i];
      db.collection("users").updateOne({
        id: user.id
      }, user, {upsert: true})
    }
    db.collection("users").find().toArray(function(error, documents) {
      respond.render("robots", {robots: documents})
    })
  })
})


app.get('/unemployed', function(request,respond){
  MongoClient.connect(url, function(error, db) {
    if (error) {
      throw error;
    }
    db.collection("users").find({job: null}).toArray(function(error, documents) {
      respond.render("robots", {robots: documents})
    })
  })
})

app.get("/employed", function(request,respond){
  MongoClient.connect(url, function(error, db) {
    if (error) {
      throw error;
    }
    db.collection("users").find({job: {$nin: [null]}}).toArray(function(error, documents) {

      respond.render("robots", {robots: documents})
    })
  })
})

app.get('/:id', function (request, respond) {
  MongoClient.connect(url, function(err, db) {
    if (err) {
      throw err;
    }
    db.collection("users").find({id: parseInt(request.params.id)}).toArray(function(err, documents) {
      respond.render("individual", {robots: documents})
    })
  })
})


app.listen(3000, function() {
  console.log('Successfully started express application!');
})
