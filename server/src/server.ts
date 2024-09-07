import App from './app';
import AuthRoute from './routes/auth.route';
import PassengerRoute from './routes/passenger.route';
import AirportRoute from './routes/airport.route';

const app = new App([
    new AuthRoute(),
    new PassengerRoute(),
    new AirportRoute(),
]);

app.listen();