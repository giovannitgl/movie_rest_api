import jwt from 'jsonwebtoken'
import {JWT_SECRET} from "./settings";
import {UserTypes} from "../entity/User";
import bcrypt from "bcrypt";

/**
 * Creates a signed JWT
 * @param email {string} - User Email
 * @param scope {number} - User Scope
 */
export function generateAccessToken(email, scope) {
    const scopeStr: string = scope === UserTypes.User ? 'User' : 'Admin'
    return jwt.sign({email, scope: scopeStr}, JWT_SECRET, { expiresIn: '1800s' });
}

/**
 * Hashes a password with salt
 * @param pwd
 */
export function hashPassword(pwd: string): string {
    return bcrypt.hashSync(pwd, 10)
}

/**
 * Compares two passsword to check access
 * @param pwd1
 * @param pwd2
 */
export function comparePassword(pwd1: string, pwd2: string) {
    return bcrypt.compareSync(pwd1, pwd2)
}
