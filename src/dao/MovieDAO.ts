import {MovieDTO, MovieFilterDTO} from "../dto/MovieDTO";
import {Movie} from "../entity/Movie";
import {getRepository} from "typeorm";
import {getFilterPagination} from "../shared/functions";
import {Actor} from "../entity/Actor";

/**
 * Searches for Movies based on filters.
 * @param filter {MovieDTO} - Filter that can query genre, director, name, actors
 */
export async function filterMovies(filter: MovieFilterDTO): Promise<Array<Movie>> {
    const {skip, take} = getFilterPagination(filter)
    const movieRepo = getRepository(Movie)
    return movieRepo.find({skip, take})
}

/**
 * Retrieves a movie by its id
 * @param id {number} - Int id for movie1
 */
export async function getMovieById(id:number): Promise<Movie | null> {
    const movieRepo = getRepository(Movie)
    return movieRepo.findOne(id, {relations: ['actors']})
}

/**
 * Creates a movie
 * @param payload {MovieDTO} - movie information to be created
 */
export async function createMovie(payload: MovieDTO): Promise<Movie | null> {
    const movieRepo = getRepository(Movie)
    const actorRepo = getRepository(Actor)

    // Create actors if needed
    payload.actors = await Promise.all(payload.actors.map(async (act) => {
        const actor = await actorRepo.findOne({name: act.name})
        if (!actor) {
            return actorRepo.save(act, {})
        }
        return actor
    }))

    return movieRepo.save(payload)
        .then((partial) => {
            return getMovieById(partial.id)
        })
}