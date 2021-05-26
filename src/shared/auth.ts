import jwt from 'jsonwebtoken'
import {JWT_SECRET} from "./settings";
import {UserTypes} from "../entity/User";

export function generateAccessToken(email, scope) {
    const scopeStr: string = scope === UserTypes.User ? 'User' : 'Admin'
    return jwt.sign({email, scope: scopeStr}, JWT_SECRET, { expiresIn: '1800s' });
}