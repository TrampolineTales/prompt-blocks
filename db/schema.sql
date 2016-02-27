DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS promptblocks CASCADE;
DROP TABLE IF EXISTS xref_users_promptblocks CASCADE;

CREATE TABLE users (
       id SERIAL UNIQUE PRIMARY KEY,
       name VARCHAR(16),
       password_digest VARCHAR(60)
);

CREATE TABLE promptblocks (
       id SERIAL UNIQUE PRIMARY KEY,
       title VARCHAR(140),
       description VARCHAR(500),
       submitter_id INT REFERENCES users(id)
);

CREATE TABLE xref_users_promptblocks (
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  promptblock_id INT REFERENCES promptblocks(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, promptblock_id)
);
