CREATE TYPE seat_class AS ENUM ('economy', 'business');

CREATE TYPE seat_status AS ENUM ('available', 'booked', 'maintenance');

CREATE TYPE user_role AS ENUM ('user', 'admin');

CREATE TYPE membership_type AS ENUM ('silver', 'gold', 'platinum');

CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled');

CREATE TABLE airport (
    airport_id UUID PRIMARY KEY,
    name VARCHAR NOT NULL,
    code VARCHAR NOT NULL UNIQUE,
    location VARCHAR
);

CREATE TABLE airplane (
    airplane_id UUID PRIMARY KEY,
    name VARCHAR NOT NULL,
    model VARCHAR,
    total_business INT,
    total_economy INT
);

CREATE TABLE flight (
    flight_id UUID PRIMARY KEY,
    airplane_id UUID REFERENCES airplane(airplane_id),
    code VARCHAR,
    departure_airport UUID REFERENCES airport(airport_id),
    arrival_airport UUID REFERENCES airport(airport_id),
    departure_time TIMESTAMP,
    arrival_time TIMESTAMP
);

CREATE TABLE seat (
    seat_id UUID PRIMARY KEY,
    airplane_id UUID REFERENCES airplane(airplane_id),
    number VARCHAR(10) NOT NULL,
    class seat_class,
    status seat_status DEFAULT 'available' 
);

CREATE TABLE flight_seat (
    flight_seat_id UUID PRIMARY KEY,
    flight_id UUID REFERENCES flight(flight_id),
    seat_id UUID REFERENCES seat(seat_id),
    price FLOAT,
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
    user_id UUID REFERENCES "user"(user_id),
    flight_seat_id UUID REFERENCES flight_seat(flight_seat_id),
    price FLOAT,
    time TIMESTAMP,
    status booking_status DEFAULT 'pending' 
);

CREATE TABLE payment (
    payment_id UUID PRIMARY KEY,
    booking_id UUID REFERENCES booking(booking_id),
    method VARCHAR,
    amount FLOAT,
    time TIMESTAMP
);
