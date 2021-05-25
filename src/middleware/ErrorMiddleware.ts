import {Response} from "express";

export class ErrorHandler extends Error {
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
    res.status(statusCode).json({
        statusCode,
        error: message
    })
}
