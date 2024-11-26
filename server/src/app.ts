import 'dotenv/config';
import http, { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import SocketSingleton from './configs/socketSingleton.config';
import compression from 'compression';
import express from 'express';
import session from 'express-session';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import morgan from 'morgan';
import cors from 'cors';

import { Routes } from './interfaces/routes.interface';
import { errorMiddleware }  from './middlewares/error.middleware';

class App {
    public app: express.Application;
    public env: string;
    public port: string | number;
    public server: http.Server;
    public io: SocketIOServer;
    
    constructor(routes: Routes[]) {
        this.app = express();
        this.env = process.env.NODE_ENV || 'dev';
        this.port = process.env.PORT || 3000;
        this.server = createServer(this.app);
        this.io = SocketSingleton.init(this.server);

        this.middlewares();
        this.initializeRoutes(routes);
        this.initializeSwagger();
        this.errorHandling();
    }

    public listen() {
        this.server.listen(this.port || 3000, () => {
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
        this.app.use(cors({
            origin: process.env.FRONTEND_URL,
            credentials: true,
        }));
        this.app.use(compression());
        this.app.use(morgan('dev'));
        this.app.use(session({
            secret: process.env.SESSION_SECRET as string,
            resave: false,
            saveUninitialized: false,
            cookie: {
                maxAge: 24 * 60 * 60 * 1000,
            }
        }));
    }

    private initializeRoutes(routes: Routes[]) {
        routes.forEach(route => {
          this.app.use('/api', route.router);
        });
        this.app.use('/images/', express.static('./'));
    }    

    private initializeSwagger() {
        const options = {
          swaggerDefinition: {
            openapi: '3.0.0',
            info: {
              title: 'REST API',
              version: '1.0.0',
              description: 'Example docs',
            },
            servers: [
              {
                url: 'http://localhost:2222',
              },
            ],
            components: {
              securitySchemes: {
                bearerAuth: {
                  type: 'http',
                  scheme: 'bearer',
                  bearerFormat: 'JWT',
                },
              },
            },
            security: [
              {
                bearerAuth: [],
              },
            ],
          },
          apis: ['swagger.yaml'],
        };
      
        const specs = swaggerJSDoc(options);
        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
    }  

    private errorHandling() {
        this.app.use(errorMiddleware);
    }
}

export default App;