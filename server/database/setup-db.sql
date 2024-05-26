DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS subjects CASCADE;
DROP TABLE IF EXISTS cards CASCADE;
DROP TABLE IF EXISTS training_records CASCADE;
DROP TABLE IF EXISTS training_sessions CASCADE;
DROP TABLE IF EXISTS card_results CASCADE;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    user_name VARCHAR NOT NULL UNIQUE,
    password VARCHAR NOT NULL
);

CREATE TABLE subjects (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    subject_name VARCHAR NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE cards (
    id SERIAL PRIMARY KEY,
    card_number INT NOT NULL,
    subject_id INT NOT NULL,
    question VARCHAR NOT NULL,
    answer VARCHAR NOT NULL,
    follows INT NULL,
    FOREIGN KEY (subject_id) REFERENCES subjects(id)
);

CREATE TABLE training_records (
    id SERIAL PRIMARY KEY,
    subject_id INT NOT NULL,
    card_id INT NOT NULL UNIQUE,
    avg_time_sec NUMERIC(4, 2) DEFAULT 0,
    review_count INT DEFAULT 0,
    correct_streak INT DEFAULT 0,
    date_to_review_next DATE DEFAULT NULL,
    FOREIGN KEY (subject_id) REFERENCES subjects(id),
    FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE
);

CREATE TABLE training_sessions (
    id SERIAL PRIMARY KEY,
    session_number INT NOT NULL,
    subject_id INT NOT NULL,
    first_pass_correct INT NULL,
    first_pass_incorrect INT NULL,
    rounds_to_finish INT NULL,
    session_start_time TIMESTAMPTZ NOT NULL,
    training_time_in_seconds INT NULL,
    FOREIGN KEY (subject_id) REFERENCES subjects(id)
);

CREATE TABLE card_results (
    id SERIAL PRIMARY KEY,
    training_session_id INT NOT NULL,
    card_id INT NOT NULL,
    question VARCHAR NOT NULL,
    guess VARCHAR NOT NULL,
    answer VARCHAR NOT NULL,
    is_correct BOOLEAN NOT NULL,
    seconds_to_answer NUMERIC(4, 2) NOT NULL,
    FOREIGN KEY (training_session_id) REFERENCES training_sessions(id),
    FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE
);
