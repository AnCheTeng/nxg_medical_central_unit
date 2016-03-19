// npm install
var express = require('express');
var mongoose = require('mongoose');

// DB Schema
var HospitalVM = require('./model/HospitalVM');

// route
var hospitalvm_route = require('./route/hospitalvm');


var app = express();

mongoose.connect('mongodb://localhost/central');

console.log("===========================Server is starting===========================");

app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(express.static('../frontend'));

app.use('/hospitalvm', hospitalvm_route);

app.get('/', function(request, response) {
  console.log('I got you');
});

app.listen('8080', function(request, response) {
  console.log('listening to 8080 port');
});
