////Requires////
require('dotenv').config();
var express = require('express');
var path = require('path');
var morgan = require('morgan');
var session = require('express-session');
var pg = require('pg');
var pgSession = require('connect-pg-simple')(session);
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
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
app.use(methodOverride('_method'));
app.use(session({
  store: new pgSession({
    pg: pg,
    conString: process.env.CONNECTION_STRING,
    tableName: 'session'
  }),
  secret: process.env.SECRET,
  resave: false,
  cookie: { maxAge: 2592000000 }
}))
//////////////////////////

////Declaring Routes////
app.get('/', db.getPromptBlocks, function(req, res) {
  res.render('index.html.ejs', { user: req.session.user, data: res.rows });
});

app.get('/login', function(req, res) {
  res.render('login.html.ejs', { user: req.session.user });
});

app.post('/login', db.loginUser, function(req, res) {
  req.session.user = res.rows;
  res.redirect('/');
});

app.delete('/logout', function(req, res) {
  req.session.destroy(function(err) {
    res.redirect('/')
  })
})

app.get('/submit', function(req, res) {
  if (req.session.user) {
    res.render('submit.html.ejs', { user: req.session.user });
  } else {
    res.status(301).json({success: false, data: 'Not logged in!'})
  }
});

app.post('/submit', db.createPromptBlock, function(req, res) {
  res.redirect('/pb/' + res.id);
});

app.get('/users/:name', db.getUserPromptBlocks, function(req, res) {
  res.render('user_page.html.ejs', { user: req.session.user, data: res.rows });
});

app.get('/pb/:id', db.getPromptBlock, function(req, res) {
  res.render('pb_page.html.ejs', { user: req.session.user, data: res.rows });
});

app.get('/signup', function(req, res) {
  res.render('signup.html.ejs', { user: req.session.user });
});

app.post('/signup', db.createUser, function(req, res) {
  res.redirect('/');
});
////////////////////////

////Starting Server////
var port = process.env.PORT || 3000;
var server = app.listen(port, function() {
  console.log('server started');
})
///////////////////////
