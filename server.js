////Requires////
var express = require('express');
var path = require('path');
var pg = require('pg');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var app = express();
var db = require('./db/pg');
var userRoutes = require( path.join(__dirname, '/routes/users'));
////////////////

app.use(express.static(path.join(__dirname + '/public')));
//http://stackoverflow.com/questions/28006301/using-css-with-express

////Activating Modules////
app.set('views', './views');
app.set('view engine', 'ejs');
app.use(morgan('short'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//////////////////////////

////Declaring Routes////
app.get('/', function(req, res) {
  res.render('index.html.ejs', {});
});

app.get('/login', function(req, res) {
  res.render('login.html.ejs', {});
});

app.get('/signup', function(req, res) {
  res.render('login.html.ejs', {});
});
////////////////////////

////Starting Server////
var port = process.env.PORT || 3000;
var server = app.listen(port, function() {
  console.log('server started');
})
///////////////////////
