import 'dotenv/config';
import compression from 'compression';
import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import cors from 'cors';

import { Routes } from './interfaces/routes.interface';
import { errorMiddleware }  from './middlewares/error.middleware';

class App {
    public app: express.Application;
    public env: string;
    public port: string | number;
    
    constructor(routes: Routes[]) {
        this.app = express();
        this.env = process.env.NODE_ENV || 'dev';
        this.port = process.env.PORT || 3000;

        this.middlewares();
        this.initializeRoutes(routes);
        this.errorHandling();
    }

    public listen() {
        this.app.listen(this.port || 3000, () => {
            console.log(`Server running on port ${this.port}`);
        })
    }

    public getServer() {
        return this.app;
    }

    private middlewares() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cookieParser());
        this.app.use(helmet());
        this.app.use(cors());
        this.app.use(compression());
        this.app.use(morgan('dev'));
    }

    private initializeRoutes(routes: Routes[]) {
        routes.forEach(route => {
          this.app.use('/api', route.router);
        });
        this.app.use('/images/', express.static('./'));
    }    

    private errorHandling() {
        this.app.use(errorMiddleware);
    }
}

export default App;