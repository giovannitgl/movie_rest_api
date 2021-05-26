import StatusCodes from 'http-status-codes';
import {Body, Post, Response, Route, Tags} from "tsoa";
import {plainToClass} from "class-transformer";
import {validate} from "class-validator";
import {ErrorHandler, IErrorHandler} from "../middleware/ErrorMiddleware";
import {printValidationError} from "../shared/functions";
import {AuthDTO, AuthRequestDTO} from "../dto/AuthDTO";
import {getUserByEmail} from "../dao/UserDAO";
import {User} from "../entity/User";
import {comparePassword, generateAccessToken, hashPassword} from "../shared/auth";

const { BAD_REQUEST, UNAUTHORIZED} = StatusCodes;

@Route('auth')
@Tags('Auth')
export default class AuthController {
    @Post('/')
    @Response<IErrorHandler>('400', 'Invalid data')
    @Response<IErrorHandler>('401', 'Unauthorized')
    public async authenticate(@Body() body: AuthRequestDTO): Promise<AuthDTO> {
        const auth: AuthRequestDTO = plainToClass(AuthRequestDTO, body)

        try {
            const validation = await validate(auth)
            if (validation.length > 0) {
                throw new ErrorHandler(BAD_REQUEST, printValidationError(validation))
            }
        } catch (err) {
            throw new ErrorHandler(BAD_REQUEST, err)
        }

        const user: User = await getUserByEmail(auth.email)
        if (!user) {
            throw new ErrorHandler(UNAUTHORIZED, 'Could not authenticate with credentials')
        }

        const success = comparePassword(auth.password, user.password)

        if (!success) {
            throw new ErrorHandler(UNAUTHORIZED, 'Could not authenticate with credentials')
        }

        return {token: generateAccessToken(user.email, user.type)}
    }
}