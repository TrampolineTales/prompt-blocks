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

----taken from connect-pg-simple----
CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
	"sess" json NOT NULL,
	"expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
------------------------------------
