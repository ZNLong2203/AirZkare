import App from './app';
import AuthRoute from './routes/auth.route';
import PassengerRoute from './routes/passenger.route';

const app = new App([
    new AuthRoute(),
    new PassengerRoute(),
]);

app.listen();