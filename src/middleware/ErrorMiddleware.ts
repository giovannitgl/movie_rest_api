import {Response} from "express";
import logger from "../shared/Logger";

export interface IErrorHandler {
    statusCode: number
    message: string
}

export class ErrorHandler extends Error implements IErrorHandler {
    /** Generic error handler for API **/
    statusCode: number
    message: string

    constructor(statusCode: number, message: string) {
        super()
        this.statusCode = statusCode
        this.message = message
    }
}

export function ErrorMiddleware(err: ErrorHandler, res: Response): void {
    /** Middleware for returning errors in api **/
    const {statusCode, message} = err
    if (!statusCode) {
        logger.err(err)
        res.status(500).json({statusCode: 500, error: 'Unexpected error.'})
    } else {
        res.status(statusCode).json({
            statusCode,
            error: message
        })

    }
}
