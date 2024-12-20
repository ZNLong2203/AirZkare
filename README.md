# AirZkare

## Overview
1. AirZkare is a user-friendly web platform designed to simplify the process of booking flights. Users can easily search for and book flights, select their preferred seats, make secure online payments, and receive email confirmations for their bookings. The platform also provides robust management tools for administrators, allowing them to oversee flights, airlines, airports, users, and ticket prices. AirZkare aims to deliver a seamless, efficient experience for both travelers and administrators.

2. Technology
    - Next.js
    - Express.js
    - Redis
    - PostgreSQL
    - Prisma ORM
    - TailwindCSS
    - Socket.io
    - Docker

## Architecture:
![alt text](uploads/architecture.png)

## ERD:
![alt text](uploads/erd.png)

## Features:

1. **User:**
    - Login / Register with JWT, Google OAuth
    - View / Edit Profile
    - Find a flight
    - Book / Cancel a flight
    - In-Flight seat selection with seat lock feature if someone else is choosing
    - Payment Gateway Stripe and QR code with Zalopay
    - Get notification email confirm about booking
    - View booking history
    - View current flight status

2. **Admin:**
    - Manage flight schedule
    - Manage seat availability
    - Manage booking
    - Manage user
    - Manage airport that flight go through
    - Dashboard with flight and booking analytics
    
