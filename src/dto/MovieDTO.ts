import {ListFilterDTO} from "./ListDTO";
import {IsArray, IsDefined, IsInt, IsOptional, IsString, Max, Min} from "class-validator";

export class MovieFilterDTO extends ListFilterDTO {
    @IsOptional()
    @IsString()
    director?: string

    @IsOptional()
    @IsString()
    genre?: string

    @IsOptional()
    actor?: string | Array<string>
}
export class BaseMovieDTO {
    @IsDefined()
    @IsString()
    title: string

    @IsDefined()
    @IsString()
    synopsis?: string

    @IsDefined()
    @IsString()
    director: string

    @IsDefined()
    @IsString()
    genre: string
}

/**
 * DTO used for creation of movies.
 * Actors will be translated from String array to an array of objects containing the actor name
 */
export class MovieCreateDTO extends BaseMovieDTO {
    @IsDefined()
    @IsArray()
    actors: Array<string>
}

export class MovieDetailDTO extends  MovieCreateDTO {
    rating: string
}

export class MovieDTO extends BaseMovieDTO {
    actors: Array<ActorDTO>
}

export class ActorDTO {
    @IsInt()
    id?: number

    @IsDefined()
    @IsString()
    name: string
}

export class RateRequestDTO {
    @IsDefined()
    @IsInt()
    @Min(0)
    @Max(4)
    rating: number
}

export class RateCreateDTO extends RateRequestDTO {
    userId: number

    movieId: number
}