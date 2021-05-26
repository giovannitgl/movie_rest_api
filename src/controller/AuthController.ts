import StatusCodes from 'http-status-codes';
import {Body, Post, Route, Tags} from "tsoa";
import {plainToClass} from "class-transformer";
import {validate} from "class-validator";
import {ErrorHandler} from "../middleware/ErrorMiddleware";
import {printValidationError} from "../shared/functions";
import {AuthDTO, AuthRequestDTO} from "../dto/AuthDTO";
import {getUserByEmail} from "../dao/UserDAO";
import {User} from "../entity/User";
import {generateAccessToken} from "../shared/auth";

const { BAD_REQUEST, NOT_FOUND } = StatusCodes;

@Route('auth')
@Tags('Auth')
export default class AuthController {
    @Post('/')
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
            throw new ErrorHandler(NOT_FOUND, 'User was not found')
        }

        return {token: generateAccessToken(user.email, user.type)}
    }
}