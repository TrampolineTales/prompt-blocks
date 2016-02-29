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
        console.log(err);
        return res.status(500).json({success: false, data: err})
      }

      var query = client.query('SELECT * FROM users WHERE name LIKE ($1);', [name], function(err, results) {
        done();
        if (err) {
          return console.error('error running query', err)
        }

        if (results.rows.length === 0) {
          res.status(204).json({success: true, data: 'no content'})
        } else if (bcrypt.compareSync(password, results.rows[0].password_digest)) {
          res.rows = results.rows[0];
          next();
        }
      });
    });
}

function createHash(name, password, callback) {
  bcrypt.genSalt(function(err, salt) {
    bcrypt.hash(password, salt, function(err, hash) {
      callback(name, hash);
    });
  });
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

      var query = client.query('INSERT INTO users( name, password_digest ) VALUES ($1, $2);', [name, hash], function(err, result) {
        done();
        if (err) {
          return console.error('error running query', err)
        }
        next();
      });
    });
  }
}

function createPromptBlock(req, res, next) {
  if (req.session.user) {
    pg.connect(process.env.CONNECTION_STRING, function(err, client, done) {
      if (err) {
        done();
        console.log(err);
        return res.status(500).json({success: false, data: err});
      }

      var query1 = client.query('INSERT INTO promptblocks( title, description ) VALUES ($1, $2) RETURNING id;', [req.body.title, req.body.description], function(err, results) {
        if (err) {
          return console.error('error running query', err)
        }
        res.id = query1._result.rows[0].id;
        var query2 = client.query('INSERT INTO xref_users_promptblocks( user_id, promptblock_id ) VALUES ($1, $2);', [req.session.user.id, query1._result.rows[0].id], function(err, results) {
          done();
          if (err) {
            return console.error('error running query', err)
          }

          next();
        });
      });
    });
  } else {
    res.status(301).json({success: false, data: 'Not logged in!'});
  }
}

function getPromptBlocks(req, res, next) {
  pg.connect(process.env.CONNECTION_STRING, function(err, client, done) {
    if (err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }

    var query = client.query('SELECT promptblocks.id, promptblocks.title, promptblocks.description, users.name FROM xref_users_promptblocks LEFT JOIN users on xref_users_promptblocks.user_id = users.id LEFT JOIN promptblocks on xref_users_promptblocks.promptblock_id = promptblocks.id ORDER BY promptblocks.id desc;', function(err, results) {
      done();
      if (err) {
        return console.error('error running query', err);
      }

      res.rows = results.rows;
      next();
    });
  });
}

function getUserPromptBlocks(req, res, next) {
  pg.connect(process.env.CONNECTION_STRING, function(err, client, done) {
    if (err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }

    var query = client.query('SELECT promptblocks.id, promptblocks.title, promptblocks.description, users.name FROM xref_users_promptblocks LEFT JOIN users on xref_users_promptblocks.user_id = users.id LEFT JOIN promptblocks on xref_users_promptblocks.promptblock_id = promptblocks.id WHERE users.name = $1 ORDER BY promptblocks.id desc;', [req.params.name], function(err, results) {
      done();
      if (err) {
        return console.error('error running query', err);
      }

      res.rows = results.rows;
      next();
    });
  });
}

function getPromptBlock(req, res, next) {
  pg.connect(process.env.CONNECTION_STRING, function(err, client, done) {
    if (err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }

    var query = client.query('SELECT promptblocks.id, promptblocks.title, promptblocks.description, users.name FROM xref_users_promptblocks LEFT JOIN users on xref_users_promptblocks.user_id = users.id LEFT JOIN promptblocks on xref_users_promptblocks.promptblock_id = promptblocks.id WHERE promptblocks.id = $1 ORDER BY promptblocks.id desc;', [req.params.id], function(err, results) {
      done();
      if (err) {
        return console.error('error running query', err);
      }

      res.rows = results.rows;
      next();
    });
  });
}

module.exports.createUser = createUser;
module.exports.loginUser = loginUser;
module.exports.createPromptBlock = createPromptBlock;
module.exports.getPromptBlocks = getPromptBlocks;
module.exports.getUserPromptBlocks = getUserPromptBlocks;
module.exports.getPromptBlock = getPromptBlock;
