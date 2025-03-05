CREATE TABLE marker
(
    id SERIAL PRIMARY KEY,
    title VARCHAR(64),
    description VARCHAR,
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION
);