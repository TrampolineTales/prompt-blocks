require('dotenv').config();
var bcrypt = require('bcrypt');
var pg = require('pg');
var salt = bcrypt.genSaltSync(10);
var session = require('express-session');

function loginUser(req, res, next) {
    var name = req.body.username;
    var password = req.body.password;

    pg.connect(process.env.CONNECTION_STRING, function(err, client, done) {
      if (err) {
        done();
        console.log(err)
        return res.status(500).json({success: false, data: err})
      }

      var query = client.query("SELECT * FROM users WHERE name LIKE ($1);", [name], function(err, results) {
        done();
        if (err) {
          return console.error('error running query', err)
        }

        if (results.rows.length === 0) {
          res.status(204).json({success: true, data: 'no content'})
        } else if (bcrypt.compareSync(password, results.rows[0].password_digest)) {
          res.rows = results.rows[0]
          next();
        }
      })
    })
}

function createHash(name, password, callback) {
  bcrypt.genSalt(function(err, salt) {
    bcrypt.hash(password, salt, function(err, hash) {
      callback(name, hash);
    })
  })
}


function createUser(req, res, next) {
  createHash(req.body.username, req.body.password, saveUser);

  function saveUser(name, hash) {
    pg.connect(process.env.CONNECTION_STRING, function(err, client, done) {
      if (err) {
        done();
        console.log(err)
        return res.status(500).json({success: false, data: err})
      }

      var query = client.query("INSERT INTO users( name, password_digest) VALUES ($1, $2);", [name, hash], function(err, result) {
        done();
        if (err) {
          return console.error('error running query', err)
        }
        next();
      })
    })
  }
}

module.exports.createUser = createUser;
module.exports.loginUser = loginUser;
