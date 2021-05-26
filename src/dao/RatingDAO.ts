import {getRepository} from "typeorm";
import {Rating} from "../entity/Rating";
import {RateCreateDTO} from "../dto/MovieDTO";

/**
 * Calculates the average rating of a movie
 * @param id
 */
export async function getRateAvgByMovieId(movieId: number): Promise<string> {
    const ratingRepo = getRepository(Rating)
    const query = `SELECT COALESCE(AVG(rating), 0) AS avg FROM rating WHERE "movieId"=${movieId}`
    const value = await ratingRepo.query(query)
    return value[0]['avg']
}

/**
 * Stores the user vote for a movie
 * @param rating
 */
export async function createRating(rating: RateCreateDTO) {
    const ratingRepo = getRepository(Rating)
    return ratingRepo.save(rating)
}