import morgan from 'morgan';
import helmet from 'helmet';

import express, { NextFunction, Request, Response } from 'express';
import "reflect-metadata"
import 'express-async-errors';
import swaggerUi from "swagger-ui-express";


import {ErrorHandler, ErrorMiddleware} from './middleware/ErrorMiddleware'
import {createConnection} from "typeorm";
import UserRouter from "./routes/UserRoutes";
import AdminRouter from "./routes/AdminRoutes";
import logger from "./shared/Logger";

const app = express();



createConnection().then(() => {
    /************************************************************************************
     *                              Set basic express settings
     ***********************************************************************************/

    app.use(express.json());
    app.use(express.static("public"));

    app.use(
        "/docs",
        swaggerUi.serve,
        swaggerUi.setup(undefined, {
            swaggerOptions: {
                url: "/swagger.json",
            },
        })
    );

    // Show routes called in console during development
    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
    }

    // Security
    if (process.env.NODE_ENV === 'production') {
        app.use(helmet());
    }

    app.use("/user", UserRouter)
    app.use("/admin", AdminRouter)

// Print API errors
// eslint-disable-next-line @typescript-eslint/no-unused-vars
    app.use((err: ErrorHandler, req: Request, res: Response, next: NextFunction) => {
        ErrorMiddleware(err, res)
    });

}).catch((err) => logger.err(err))

// Export express instance
export default app;
