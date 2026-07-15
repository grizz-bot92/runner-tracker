CREATE TABLE race(
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  date  DATE,
  distance DECIMAL,
  elevation_gain INTEGER,
  cutoff_time INTERVAL
);


CREATE TABLE runner(
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  age INT,
  bib_number  INT UNIQUE ,
  emergency_contact_name VARCHAR(255),
  emergency_contact_number VARCHAR(255),
  race_id INT REFERENCES race(id),
  status VARCHAR(10)
);

CREATE TABLE aid_station(
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  mile_marker DECIMAL,
  crew_access BOOLEAN,
  race_id INTEGER REFERENCES race(id),
  cutoff_time INTERVAL
);

CREATE TABLE check_in(
  id SERIAL PRIMARY KEY,
  runner_id INTEGER REFERENCES runner(id),
  aid_station_id INTEGER REFERENCES aid_station(id),
  checked_in_at TIMESTAMPTZ
);

CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL
);
