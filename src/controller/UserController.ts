import StatusCodes from 'http-status-codes';
import {ErrorHandler} from "../middleware/ErrorMiddleware";
import {UserCreateDTO, UserDisplayDTO, UserDTO, UserInternalDTO} from "../dto/UserDTO";
import {plainToClass} from "class-transformer";
import {validate} from "class-validator";
import {Body, Delete, Get, Path, Post, Put, Route, Tags} from 'tsoa';
import {User, UserTypes} from "../entity/User";
import {createUser, getUserById, updateUser} from "../dao/UserDao";
import {printValidationError} from "../shared/functions";

const { BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR, NO_CONTENT } = StatusCodes;

@Route('user')
@Tags('User')
export default class UserController {
    /**
     * Retrieves user by id
     * @param id {int} User id
     */
    @Get('/:id')
    public async getUser(@Path() id: number): Promise<UserDTO> {
        if (isNaN(id)) {
            throw new ErrorHandler(BAD_REQUEST, 'User id must be an int')
        }

        const user: User | undefined = await getUserById(id, UserTypes.User)
        if (user == null) {
            throw new ErrorHandler(NOT_FOUND, 'User not found.')
        }

        return getUserDTO(user)
    }


    /**
     * Creates user
     * @param body {UserCreateDTO} Formatted user data to be created
     */
    @Post('/')
    public async registerUser(@Body() body: UserCreateDTO): Promise<UserDTO> {
        const user: UserCreateDTO = plainToClass(UserCreateDTO, body)
        try {
            const validation = await validate(user)
            if (validation.length > 0) {
                throw new ErrorHandler(BAD_REQUEST, printValidationError(validation))
            }
        } catch (err) {
            throw new ErrorHandler(BAD_REQUEST, err)
        }

        const newUser = await createTypedUser(user, UserTypes.User)
        return getUserDTO(newUser)
    }

    /**
     * Excludes user from system
     * @param id {int} user id to exclude
     */
    @Delete('/:id')
    public async deleteUser(@Path() id: number): Promise<boolean> {
        const user = await getUserById(id)
        if (!user) {
            throw new ErrorHandler(NOT_FOUND, 'User not found.')
        }

        user.active = false
        await updateUser(id, user)
        return true
    }

    /**
     * Updates information for an user
     * @param id {int} user id to update
     * @param body {UserDTO} user data to be updated
     */
    @Put('/:id')
    public async updateUser(@Path() id: number, @Body() body: UserDTO): Promise<UserDTO> {
        const user = await getUserById(id)
        if (!user) {
            throw new ErrorHandler(NOT_FOUND, 'User not found.')
        }

        const userPayload: UserDTO = plainToClass(UserDTO, body)

        try {
            const validation = await validate(user)
            if (validation.length > 0) {
                throw new ErrorHandler(BAD_REQUEST, printValidationError(validation))
            }
        } catch (err) {
            throw new ErrorHandler(BAD_REQUEST, err)
        }

        const updatedUser = await updateUser(id, userPayload)
        return getUserDTO(updatedUser)

    }

}

export async function createTypedUser(dto: UserDTO, type: UserTypes): Promise<User | undefined> {
    /**
     * Internal function used to create users with a type.
     * Type 0 = Admin
     * Type 1 = User
     */
    const typedUser: UserInternalDTO = plainToClass(UserInternalDTO, dto)
    typedUser['type'] = type

    try {
        return await createUser(typedUser)
    } catch (err) {
        const msg: string = (err as Error).toString()
        if (msg.includes('unique constraint')) {
            throw new ErrorHandler(BAD_REQUEST, 'User already exists.')
        }

        throw new ErrorHandler(INTERNAL_SERVER_ERROR, 'Could not create user.')
    }
}

export function getUserDTO(user: User): UserDisplayDTO {
    return {
        id: user.id,
        age: user.age,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
    }
}