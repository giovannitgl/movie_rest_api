import StatusCodes from 'http-status-codes';
import {Body, Delete, Get, Path, Post, Put, Route, Tags} from "tsoa";
import {UserCreateDTO, UserDTO} from "../dto/UserDTO";
import {ErrorHandler} from "../middleware/ErrorMiddleware";
import {User, UserTypes} from "../entity/User";
import {plainToClass} from "class-transformer";
import {validate} from "class-validator";
import {hashPassword, printValidationError} from "../shared/functions";
import {createTypedUser, getUserDTO} from "./UserController";
import {getUserById, updateUser} from "../dao/UserDAO";

const { BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR, NO_CONTENT } = StatusCodes;


@Route('admin')
@Tags('Admin')
export default class AdminController {
    /**
     * Retrieves an admin by id
     * @param id
     */
    @Get('/:id')
    public async getAdmin(@Path() id: number): Promise<UserDTO> {
        if (isNaN(id)) {
            throw new ErrorHandler(BAD_REQUEST, 'User id must be an int')
        }

        const user: User | undefined = await getUserById(id, UserTypes.Admin)
        if (user == null) {
            throw new ErrorHandler(NOT_FOUND, 'User not found.')
        }

        return getUserDTO(user)
    }


    /**
     *  Register a new administrator
     * @todo Enforce admin only
     * @param body {UserCreateDTO} Body of the user to be created as admin
     */
    @Post('/')
    public async registerAdmin(@Body() body: UserCreateDTO): Promise<UserDTO> {
        const user: UserCreateDTO = plainToClass(UserCreateDTO, body)
        try {
            const validation = await validate(user)
            if (validation.length > 0) {
                throw new ErrorHandler(BAD_REQUEST, printValidationError(validation))
            }
        } catch (err) {
            throw new ErrorHandler(BAD_REQUEST, err)
        }

        user.password = hashPassword(user.password)
        const newUser = await createTypedUser(user, UserTypes.Admin)
        return getUserDTO(newUser)
    }

    /**
     * Excludes admin from system
     * @param id {int} user id to exclude
     */
    @Delete('/:id')
    public async deleteAdmin(@Path() id: number): Promise<boolean> {
        const user = await getUserById(id)
        if (!user) {
            throw new ErrorHandler(NOT_FOUND, 'Admin not found.')
        }

        user.active = false
        await updateUser(id, user)
        return true
    }

    /**
     * Updates information for an admin
     * @param id {int} user id to update
     * @param body {UserDTO} user data to be updated
     */
    @Put('/:id')
    public async updateAdmin(@Path() id: number, @Body() body: UserDTO): Promise<UserDTO> {
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