-- Insert into airport table
INSERT INTO airport (airport_id, name, code, location)
VALUES 
    (gen_random_uuid(), 'John F. Kennedy International Airport', 'JFK', 'New York, USA'),
    (gen_random_uuid(), 'Los Angeles International Airport', 'LAX', 'Los Angeles, USA'),
    (gen_random_uuid(), 'London Heathrow Airport', 'LHR', 'London, UK');

-- Insert into airplane table
INSERT INTO airplane (airplane_id, name, model, total_business, total_economy)
VALUES 
    (gen_random_uuid(), 'Boeing 737', '737-800', 16, 144),
    (gen_random_uuid(), 'Airbus A320', 'A320neo', 12, 138);

-- Insert into flight table
INSERT INTO flight (flight_id, airplane_id, code, type, status, price_business, price_economy, departure_airport, arrival_airport, departure_time, arrival_time)
VALUES 
    (gen_random_uuid(), (SELECT airplane_id FROM airplane LIMIT 1), 'AA101', 'non-stop', 'on-time', 1200.50, 500.00, 
        (SELECT airport_id FROM airport WHERE code='JFK'), 
        (SELECT airport_id FROM airport WHERE code='LAX'), 
        '2024-11-01 08:00:00', '2024-11-01 11:30:00'),
    (gen_random_uuid(), (SELECT airplane_id FROM airplane OFFSET 1 LIMIT 1), 'BA202', 'non-stop', 'on-time', 1300.75, 550.25, 
        (SELECT airport_id FROM airport WHERE code='LHR'), 
        (SELECT airport_id FROM airport WHERE code='JFK'), 
        '2024-11-02 15:00:00', '2024-11-02 18:30:00');

-- Insert into seat table
INSERT INTO seat (seat_id, airplane_id, number, class)
VALUES 
    (gen_random_uuid(), (SELECT airplane_id FROM airplane LIMIT 1), '1A', 'business'),
    (gen_random_uuid(), (SELECT airplane_id FROM airplane LIMIT 1), '2A', 'economy'),
    (gen_random_uuid(), (SELECT airplane_id FROM airplane OFFSET 1 LIMIT 1), '1B', 'business'),
    (gen_random_uuid(), (SELECT airplane_id FROM airplane OFFSET 1 LIMIT 1), '3C', 'economy');

-- Insert into user table
INSERT INTO "user" (user_id, username, password, email, image, provider, provider_code, role)
VALUES 
    (gen_random_uuid(), 'john_doe', 'password123', 'john.doe@example.com', NULL, 'local', '12345', 'user'),
    (gen_random_uuid(), 'admin_user', 'securePass456', 'admin@example.com', NULL, 'local', '67890', 'admin');

-- Insert into passenger table
INSERT INTO passenger (passenger_id, user_id, name, age, gender, dob, phone, city, country, nationality, passport, membership)
VALUES 
    (gen_random_uuid(), (SELECT user_id FROM "user" WHERE username='john_doe'), 'John Doe', 35, 'male', '1989-05-15', '1234567890', 'New York', 'USA', 'American', 'A1234567', 'gold'),
    (gen_random_uuid(), (SELECT user_id FROM "user" WHERE username='admin_user'), 'Jane Smith', 28, 'female', '1995-02-10', '0987654321', 'Los Angeles', 'USA', 'American', 'B7654321', 'silver');

-- Insert into flight_seat table
INSERT INTO flight_seat (flight_seat_id, flight_id, passenger_id, seat_id, is_booked)
VALUES 
    (gen_random_uuid(), (SELECT flight_id FROM flight LIMIT 1), (SELECT passenger_id FROM passenger WHERE name='John Doe'), (SELECT seat_id FROM seat WHERE number='1A'), TRUE),
    (gen_random_uuid(), (SELECT flight_id FROM flight OFFSET 1 LIMIT 1), (SELECT passenger_id FROM passenger WHERE name='Jane Smith'), (SELECT seat_id FROM seat WHERE number='3C'), TRUE);

-- Insert into booking table
INSERT INTO booking (booking_id, user_id, type, status, time)
VALUES 
    (gen_random_uuid(), (SELECT user_id FROM "user" WHERE username='john_doe'), 'roundTrip', 'confirmed', '2024-10-25 10:00:00'),
    (gen_random_uuid(), (SELECT user_id FROM "user" WHERE username='admin_user'), 'oneWay', 'pending', '2024-10-25 11:00:00');

-- Insert into payment table
INSERT INTO payment (payment_id, booking_id, method, amount, time)
VALUES 
    (gen_random_uuid(), (SELECT booking_id FROM booking WHERE user_id = (SELECT user_id FROM "user" WHERE username='john_doe')), 'credit_card', 1500.75, '2024-10-25 10:15:00'),
    (gen_random_uuid(), (SELECT booking_id FROM booking WHERE user_id = (SELECT user_id FROM "user" WHERE username='admin_user')), 'paypal', 750.50, '2024-10-25 11:10:00');

-- Insert into booking_passenger table
INSERT INTO booking_passenger (booking_passenger_id, booking_id, passenger_id)
VALUES 
    (gen_random_uuid(), (SELECT booking_id FROM booking WHERE user_id = (SELECT user_id FROM "user" WHERE username='john_doe')), (SELECT passenger_id FROM passenger WHERE name='John Doe')),
    (gen_random_uuid(), (SELECT booking_id FROM booking WHERE user_id = (SELECT user_id FROM "user" WHERE username='admin_user')), (SELECT passenger_id FROM passenger WHERE name='Jane Smith'));
