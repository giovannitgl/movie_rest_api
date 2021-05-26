import express from "express";
import MovieController from "../controller/MovieController";
import StatusCodes from 'http-status-codes';
import {MovieFilterDTO} from "../dto/MovieDTO";
import {plainToClass} from "class-transformer";
import {authenticateMiddleware} from "../middleware/AuthenticationMiddleware";

const {CREATED, OK} = StatusCodes;

const router = express.Router();

router.get("/:id", async (req, res) => {
    const controller = new MovieController();
    const movie = await controller.getMovieDetails(parseInt(req.params.id));
    return res.status(OK).json(movie)
});

router.get("/",
    async (req, res) => {
        const query: MovieFilterDTO = plainToClass(MovieFilterDTO, req.query)
        const {entries, page, director, genre, title, actors} = query
        const controller = new MovieController()
        const movies = await controller.listMovies(entries, page, director, genre, title, actors)
        return res.status(OK).json(movies)
    })

router.post("/",
    authenticateMiddleware('jwt', ['Admin']),
    async (req, res) => {
        const controller = new MovieController();
        const movie = await controller.registerMovie(req.body);
        return res.status(CREATED).json(movie)
    });

router.post("/:id/rate",
    authenticateMiddleware('jwt', ['User']),
    async (req, res) => {
        const controller = new MovieController();
        const rating = await controller.registerRate(parseInt(req.params.id), req.body, req['user'])
        return res.status(OK).json(rating)
    });

export default router;