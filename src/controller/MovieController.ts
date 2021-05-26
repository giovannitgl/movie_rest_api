import StatusCodes from 'http-status-codes';
import {ErrorHandler, IErrorHandler} from "../middleware/ErrorMiddleware";
import {plainToClass} from "class-transformer";
import {validate} from "class-validator";
import {
    Body,
    Get,
    Path,
    Post, Query,
    Request,
    Response,
    Route,
    Security,
    SuccessResponse,
    Tags
} from 'tsoa';
import {User} from "../entity/User";
import {printValidationError} from "../shared/functions";
import {
    ActorDTO, BaseMovieDTO,
    MovieCreateDTO, MovieDetailDTO,
    MovieDTO,
    MovieFilterDTO,
    RateCreateDTO, RateRequestDTO,
} from "../dto/MovieDTO";
import {createMovie, filterMovies, getMovieById} from "../dao/MovieDAO";
import {createRating, getRateAvgByMovieId} from "../dao/RatingDAO";
import {Movie} from "../entity/Movie";
import {ListResponseDTO} from "../dto/ListDTO";

const {BAD_REQUEST, NOT_FOUND,} = StatusCodes;

@Route('movie')
@Tags('Movie')
export default class MovieController {
    /**
     * Retrieves movie detail by id
     * @param id {int} User id
     */
    @Get('/:id')
    @Response<IErrorHandler>('404', 'Not Found')
    @Response<IErrorHandler>('400', 'Bad id')
    public async getMovieDetails(@Path() id: number): Promise<MovieDetailDTO> {
        if (isNaN(id)) {
            throw new ErrorHandler(BAD_REQUEST, 'Movie id must be an int')
        }

        const movie: Movie | undefined = await getMovieById(id)
        if (!movie) {
            throw new ErrorHandler(NOT_FOUND, 'Movie not found.')
        }

        let rating = await getRateAvgByMovieId(id)
        rating = parseFloat(rating).toFixed(2)

        return getMovieDTO(movie, rating) as MovieDetailDTO
    }

    /**
     * List movies based on filters.
     * @param entries Number of entries to be fetches
     * @param page Number of page of entries. Ex: Page 0 Entries 10 = [0: 10), Page 1 Entries 10 [10, 20)
     * @param director Name of director
     * @param genre Name of movie genre
     * @param title Title of the movie
     * @param actors Names of actors to be filtered
     */
    @Get('/')
    public async listMovies(@Query() entries: number,
                            @Query() page: number,
                            @Query() director?: string,
                            @Query() genre?: string,
                            @Query() title?: string,
                            @Query() actors?: Array<string>): Promise<ListResponseDTO> {
        let filter: MovieFilterDTO = {entries, page, director, genre, actors, title}
        filter = plainToClass(MovieFilterDTO, filter)
        try {
            const validation = await validate(filter)
            if (validation.length > 0) {
                throw new ErrorHandler(BAD_REQUEST, printValidationError(validation))
            }
        } catch (err) {
            throw new ErrorHandler(BAD_REQUEST, err)
        }

        const data = await filterMovies(filter)
        return {
            data: data[0],
            total: data[1]
        }
    }

    /**
     * Register a movie in the system.
     * Authenticated Endpoint: Admins
     * @param body {MovieCreateDTO} - Formatted user data to be created
     */
    @Security('jwt', ['Admin'])
    @Post('/')
    @SuccessResponse("201", "Created")
    @Response<IErrorHandler>('400', 'Invalid Data')
    @Response<IErrorHandler>('401', 'Unauthorized')
    public async registerMovie(@Body() body: MovieCreateDTO): Promise<MovieDTO> {
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
     * Rate a movie.
     * Authenticated method: Users
     * @param id {int} - Movie id being rated
     * @param payload {RateRequestDTO} - Payload with the value of the rating
     * @param user {User} - User voting
     */
    @Security('jwt', ['User'])
    @Post('/:id/rate')
    @Response<IErrorHandler>('400', 'Invalid Data')
    @Response<IErrorHandler>('404', 'Not found')
    @Response<IErrorHandler>('401', 'Unauthorized')
    public async registerRate(@Path() id: number, @Body() payload: RateRequestDTO, @Request() user: User): Promise<RateRequestDTO> {
        const rating: RateRequestDTO = plainToClass(RateRequestDTO, payload)
        try {
            const validation = await validate(rating)
            if (validation.length > 0) {
                throw new ErrorHandler(BAD_REQUEST, printValidationError(validation))
            }
        } catch (err) {
            throw new ErrorHandler(BAD_REQUEST, err)
        }

        const movie: MovieDTO = await getMovieById(id)
        if (!movie) {
            throw new ErrorHandler(NOT_FOUND, 'Movie not found.')
        }

        const ratingEntity: RateCreateDTO = {
            ...rating,
            movieId: id,
            userId: user.id
        }
        await createRating(ratingEntity)
        return rating
    }
}

/**
 * Returns display movie DTO
 * @param movie
 * @param rating
 */
function getMovieDTO(movie: Movie, rating?: string): BaseMovieDTO {
    const actors = movie.actors ? movie.actors.map((act) => act.name) : []
    const dto = {
        ...movie,
        actors,
    }
    if (rating) {
        dto['rating'] = rating
    }
    return dto
}
