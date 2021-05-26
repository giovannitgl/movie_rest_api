import StatusCodes from 'http-status-codes';
import {ErrorHandler} from "../middleware/ErrorMiddleware";
import {plainToClass} from "class-transformer";
import {validate} from "class-validator";
import {Body, Get, Path, Post, Request, Route, Security, Tags} from 'tsoa';
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

const { BAD_REQUEST, NOT_FOUND, } = StatusCodes;

@Route('movie')
@Tags('Movie')
export default class MovieController {
    /**
     * Retrieves movie detail by id
     * @param id {int} User id
     */
    @Get('/:id')
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
     * List users according to filter
     * @param filters
     */
    // @Get('/')
    public async listMovies(filters: MovieFilterDTO): Promise<any> {
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
     * @param body {MovieCreateDTO} Formatted user data to be created
     */
    @Security('jwt', ['Admin'])
    @Post('/')
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

    @Security('jwt', ['User'])
    @Post('/:id/rate')
    public async registerRate(@Path() movieId: number, @Body() payload: RateRequestDTO, @Request() user: User): Promise<RateRequestDTO> {
        const rating: RateRequestDTO = plainToClass(RateRequestDTO, payload)
        try {
            const validation = await validate(rating)
            if (validation.length > 0) {
                throw new ErrorHandler(BAD_REQUEST, printValidationError(validation))
            }
        } catch (err) {
            throw new ErrorHandler(BAD_REQUEST, err)
        }

        const movie: MovieDTO = await getMovieById(movieId)
        if (!movie) {
            throw new ErrorHandler(NOT_FOUND, 'Movie not found.')
        }

        const ratingEntity: RateCreateDTO = {
            ...rating,
            movieId,
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
