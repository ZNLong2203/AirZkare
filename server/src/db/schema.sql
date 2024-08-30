CREATE TABLE "user" (
    user_id UUID PRIMARY KEY,
    username VARCHAR NOT NULL,
    password VARCHAR NOT NULL,
    name VARCHAR,
    email VARCHAR,
    provider VARCHAR,
    provider_code VARCHAR,
    role VARCHAR
);

CREATE TABLE "token" (
    token_id VARCHAR PRIMARY KEY,
    user_id UUID,
    token VARCHAR NOT NULL,
    expire BIGINT,
    FOREIGN KEY (user_id) REFERENCES "user"(user_id)
);

CREATE TABLE "passenger" (
    user_id UUID PRIMARY KEY,
    age BIGINT,
    passport VARCHAR,
    membership VARCHAR,
    FOREIGN KEY (user_id) REFERENCES "user"(user_id)
);

CREATE TABLE "travel_class" (
    travel_class_id UUID PRIMARY KEY,
    name VARCHAR NOT NULL,
    capacity BIGINT
);

CREATE TABLE "airport" (
    airport_id VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL,
    location VARCHAR
);


CREATE TABLE "flight" (
    flight_id VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL,
    departure_id VARCHAR,
    arrival_id VARCHAR,
    departure_time TIMESTAMP,
    arrival_time TIMESTAMP,
    FOREIGN KEY (departure_id) REFERENCES "airport"(airport_id),
    FOREIGN KEY (arrival_id) REFERENCES "airport"(airport_id)
);


CREATE TABLE "seat" (
    seat_id VARCHAR PRIMARY KEY,
    travel_class_id UUID,
    flight_id VARCHAR,
    number VARCHAR NOT NULL,
    cost FLOAT,
    status BIGINT,
    FOREIGN KEY (travel_class_id) REFERENCES "travel_class"(travel_class_id),
    FOREIGN KEY (flight_id) REFERENCES "flight"(flight_id)
);

CREATE TABLE "booking" (
    booking_id VARCHAR PRIMARY KEY,
    user_id UUID,
    seat_id VARCHAR,
    cost FLOAT,
    date TIMESTAMP,
    status VARCHAR,
    FOREIGN KEY (user_id) REFERENCES "user"(user_id),
    FOREIGN KEY (seat_id) REFERENCES "seat"(seat_id)
);

CREATE TABLE "payment" (
    payment_id UUID PRIMARY KEY,
    booking_id VARCHAR,
    method VARCHAR,
    amount BIGINT,
    time TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES "booking"(booking_id)
);


