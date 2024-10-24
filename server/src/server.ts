import App from './app';
import AuthRoute from './routes/auth.route';
import PassengerRoute from './routes/passenger.route';
import AirportRoute from './routes/airport.route';
import AirplaneRoute from './routes/airplane.route';
import FlightRoute from './routes/flight.route';
import BookingRoute from './routes/booking.route';
import DashboardRoute from './routes/dashboard.route';

const app = new App([
    new AuthRoute(),
    new PassengerRoute(),
    new AirportRoute(),
    new AirplaneRoute(),
    new FlightRoute(),
    new BookingRoute(),
    new DashboardRoute(),
]);

app.listen();