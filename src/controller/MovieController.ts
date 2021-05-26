import StatusCodes from 'http-status-codes';
import {ErrorHandler} from "../middleware/ErrorMiddleware";
import {UserCreateDTO, UserDisplayDTO, UserDTO, UserInternalDTO} from "../dto/UserDTO";
import {plainToClass} from "class-transformer";
import {validate} from "class-validator";
import {Body, Delete, Get, Path, Post, Put, Query, Route, Tags} from 'tsoa';
import {User, UserTypes} from "../entity/User";
import {createUser, getUserById, updateUser} from "../dao/UserDAO";
import {printValidationError} from "../shared/functions";
import {ActorDTO, MovieCreateDTO, MovieDTO, MovieFilterDTO} from "../dto/MovieDTO";
import {ListFilterDTO} from "../dto/ListDTO";
import {createMovie, filterMovies} from "../dao/MovieDAO";

const { BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR, NO_CONTENT } = StatusCodes;

@Route('movie')
@Tags('Movie')
export default class MovieController {
    /**
     * Retrieves movie detail by id
     * @param id {int} User id
     */
    @Get('/:id')
    public async getMovieDetails(@Path() id: number): Promise<UserDTO> {
        if (isNaN(id)) {
            throw new ErrorHandler(BAD_REQUEST, 'Movie id must be an int')
        }

        const user: User | undefined = await getUserById(id, UserTypes.User)
        if (user == null) {
            throw new ErrorHandler(NOT_FOUND, 'Movie not found.')
        }

        return getUserDTO(user)
    }

    /**
     * List users according to filter
     * @param filters
     */
    @Get('/')
    public async listMovies(@Query() filters: MovieFilterDTO): Promise<any> {
        const filter: MovieFilterDTO = plainToClass(MovieFilterDTO, filters)
        try {
            const validation = await validate(filter)
            if (validation.length > 0) {
                throw new ErrorHandler(BAD_REQUEST, printValidationError(validation))
            }
        } catch (err) {
            throw new ErrorHandler(BAD_REQUEST, err)
        }

        return filterMovies(filter)
    }

    /**
     * Register a movie in the system.
     * Only allowed by admins.
     * @param body {UserCreateDTO} Formatted user data to be created
     */
    @Post('/')
    public async registerMovie(@Body() body: UserCreateDTO): Promise<MovieDTO> {
        const movie: MovieCreateDTO = plainToClass(MovieCreateDTO, body)

        try {
            const validation = await validate(movie)
            if (validation.length > 0) {
                throw new ErrorHandler(BAD_REQUEST, printValidationError(validation))
            }
        } catch (err) {
            throw new ErrorHandler(BAD_REQUEST, err)
        }

        const actors: Array<ActorDTO> = movie.actors.map((actor) => ({name: actor}))
        const movieCreateData: MovieDTO = {
            ...movie,
            actors,
        }

        return await createMovie(movieCreateData)
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