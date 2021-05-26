import * as express from "express";
import * as jwt from "jsonwebtoken";
import {JWT_SECRET} from "./shared/settings";
import {ErrorHandler} from "./middleware/ErrorMiddleware";

export function expressAuthentication(
    request: express.Request,
    securityName: string,
    scopes?: string[]
): Promise<any> {
    if (securityName === "jwt") {
        let token = request.headers["authorization"];


        return new Promise((resolve, reject) => {
            if (!token) {
                reject(new ErrorHandler(401, "No token provided"));
            }
            token = token.replace('Bearer ', '')
            jwt.verify(token, JWT_SECRET, function (err: any, decoded: any) {
                if (err) {
                    reject(new ErrorHandler(401, err.message));
                } else {
                    // Check if JWT contains all required scopes
                    for (const scope of scopes) {
                        if (decoded.scope !== scope) {
                            reject(new ErrorHandler(401, "JWT does not contain required scope."));
                        }
                    }
                    resolve(decoded);
                }
            });
        });
    }
}
