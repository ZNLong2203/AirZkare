CREATE TYPE seat_class AS ENUM ('economy', 'business');

CREATE TYPE user_role AS ENUM ('user', 'admin');

CREATE TYPE membership_type AS ENUM ('silver', 'gold', 'platinum');

CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled');

CREATE TYPE booking_flight_status AS ENUM ('outbound', 'inbound');

CREATE TYPE flight_type AS ENUM('non-stop', 'connecting');

CREATE TYPE flight_status AS ENUM('on-time', 'delayed', 'cancelled', 'done');

CREATE TABLE airport (
    airport_id UUID PRIMARY KEY,
    name VARCHAR NOT NULL,
    code VARCHAR NOT NULL UNIQUE,
    location VARCHAR NOT NULL
);

CREATE TABLE airplane (
    airplane_id UUID PRIMARY KEY,
    name VARCHAR NOT NULL,
    model VARCHAR NOT NULL,
    total_business FLOAT NOT NULL,
    total_economy FLOAT NOT NULL
);

CREATE TABLE flight (
    flight_id UUID PRIMARY KEY,
    airplane_id UUID REFERENCES airplane(airplane_id) NOT NULL,
    code VARCHAR NOT NULL,
    type VARCHAR DEFAULT 'non-stop',
    status VARCHAR DEFAULT 'on-time',
    price_business FLOAT NOT NULL,
    price_economy FLOAT NOT NULL,
    departure_airport UUID REFERENCES airport(airport_id) NOT NULL,
    arrival_airport UUID REFERENCES airport(airport_id) NOT NULL,
    departure_time TIMESTAMP NOT NULL,
    arrival_time TIMESTAMP NOT NULL
);

CREATE TABLE seat (
    seat_id UUID PRIMARY KEY,
    airplane_id UUID REFERENCES airplane(airplane_id) NOT NULL,
    number VARCHAR(10) NOT NULL,
    class seat_class NOT NULL
);

CREATE TABLE flight_seat (
    flight_seat_id UUID PRIMARY KEY,
    flight_id UUID REFERENCES flight(flight_id) NOT NULL,
    seat_id UUID REFERENCES seat(seat_id) NOT NULL,
    is_booked BOOLEAN DEFAULT FALSE
);

CREATE TABLE "user" (
    user_id UUID PRIMARY KEY,
    username VARCHAR UNIQUE NOT NULL,
    password VARCHAR NOT NULL,
    email VARCHAR NOT NULL UNIQUE,
    image VARCHAR,
    provider VARCHAR,
    provider_code VARCHAR,
    role user_role DEFAULT 'user' 
);

CREATE TABLE passenger (
    passenger_id UUID PRIMARY KEY,
    user_id UUID REFERENCES "user"(user_id),
    age INT,
    gender VARCHAR,
    dob DATE,
    phone VARCHAR,
    city VARCHAR,
    country VARCHAR,
    nationality VARCHAR,
    passport VARCHAR,
    membership membership_type DEFAULT 'silver' 
);

CREATE TABLE booking (
    booking_id UUID PRIMARY KEY,
    user_id UUID REFERENCES "user"(user_id) NOT NULL,
    status booking_status DEFAULT 'pending', 
    time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE payment (
    payment_id UUID PRIMARY KEY,
    booking_id UUID REFERENCES booking(booking_id) NOT NULL,
    method VARCHAR,
    amount FLOAT NOT NULL,
    time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE booking_flight (
    booking_flight_id UUID PRIMARY KEY,
    booking_id UUID REFERENCES booking(booking_id) NOT NULL,
    flight_seat_id UUID REFERENCES flight_seat(flight_seat_id) NOT NULL,
    flight_type booking_flight_status DEFAULT 'outbound'
);
