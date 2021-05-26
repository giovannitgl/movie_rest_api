import express from "express";
import MovieController from "../controller/MovieController";
import StatusCodes from 'http-status-codes';
import {MovieFilterDTO} from "../dto/MovieDTO";
import {plainToClass} from "class-transformer";

const { CREATED, OK} = StatusCodes;

const router = express.Router();

// router.get("/:id", async (req, res) => {
//     const controller = new  MovieController();
//     const user = await controller.getUser(parseInt(req.params.id));
//     return res.status(OK).json(user)
// });

router.get("/", async (req, res) => {
    const query: MovieFilterDTO = plainToClass(MovieFilterDTO, req.query)
    const controller = new MovieController()
    const movies = await controller.listMovies(query)
    return res.status(OK).json(movies)
})

router.post("/", async (req, res) => {
    const controller = new MovieController();
    const movie = await controller.registerMovie(req.body);
    return res.status(CREATED).json(movie)
});

// router.put("/:id", async (req, res) => {
//     const controller = new MovieController();
//     const user = await controller.updateUser(parseInt(req.params.id), req.body);
//     return res.status(OK).json(user)
// });
//
// router.delete("/:id", async (req, res) => {
//     const controller = new MovieController();
//     await controller.deleteUser(parseInt(req.params.id));
//     return res.status(OK)
// });
//
export default router;