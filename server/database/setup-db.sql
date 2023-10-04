
DROP TABLE IF EXISTS card_results;
DROP TABLE IF EXISTS training_sessions;
DROP TABLE IF EXISTS cards;
DROP TABLE IF EXISTS subjects;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS card_schedules;

CREATE TABLE users(
   id  SERIAL PRIMARY KEY,
   user_name            VARCHAR       NOT NULL UNIQUE,
   password            VARCHAR       NOT NULL);


CREATE TABLE subjects(
   id  SERIAL PRIMARY KEY,
   user_id            INT       NOT NULL,
   subject_name            VARCHAR       NOT NULL,
   FOREIGN KEY (user_id) REFERENCES users(id));

CREATE TABLE cards(
   id  		SERIAL PRIMARY KEY,
   subject_id            INT       NOT NULL,
   question            VARCHAR       NOT NULL,
   answer  	VARCHAR  NOT NULL,
   card_to_follow            INT       NULL,
   FOREIGN KEY (subject_id) REFERENCES subjects(id));

CREATE TABLE training_sessions(
   id  		SERIAL PRIMARY KEY,
   user_id            INT       NOT NULL,
   subject_id            INT       NOT NULL,
   num_correct            INT       NULL,
   num_incorrect            INT       NULL,
   session_start_time  	TIMESTAMPTZ  NOT NULL,
   training_time_in_seconds            FLOAT       NULL,
   FOREIGN KEY (user_id) REFERENCES users(id), 
   FOREIGN KEY (subject_id) REFERENCES subjects(id));


CREATE TABLE card_results(
   id  		SERIAL PRIMARY KEY,
   training_session_id            INT       NOT NULL,
   subject_id            INT       NOT NULL,
   card_id            INT       NOT NULL,
   guess            VARCHAR       NOT NULL,
   answer            VARCHAR       NOT NULL,
   is_correct  	boolean  NOT NULL,
   seconds_to_answer            FLOAT       NOT NULL);


CREATE TABLE card_schedules(
   id  		SERIAL PRIMARY KEY,
   subject_id            INT       NOT NULL,
   card_id            INT       NOT NULL,
   buoyancy            FLOAT       DEFAULT 0.0,
   next_review_date            DATE       NULL,
   first_reviewed  	TIMESTAMPTZ  NOT NULL);
