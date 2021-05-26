import {expressAuthentication} from "../authentication";
import {User} from "../entity/User";
import {getUserByEmail} from "../dao/UserDAO";

export function authenticateMiddleware(name: string, scopes: string[] = []) {
    return (request: any, response: any, next: any) => {
        expressAuthentication(request, name, scopes).then(
            (user: User) => {
                getUserByEmail(user.email).then((usr) => {
                    request['user'] = usr
                    next();
                })
            }).catch((error: any) => {
            next(error)
        });
    }
}
