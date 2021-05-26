import express from "express";
import UserController from "../controller/UserController";
import StatusCodes from 'http-status-codes';
import {authenticateMiddleware} from "../middleware/AuthenticationMiddleware";

const { CREATED, OK} = StatusCodes;

const router = express.Router();

router.get("/:id",
    authenticateMiddleware('jwt', ['User']),
    async (req, res) => {
    const controller = new  UserController();
    const user = await controller.getUser(parseInt(req.params.id));
    return res.status(OK).json(user)
});

router.post("/register", async (req, res) => {
    const controller = new UserController();
    const user = await controller.registerUser(req.body);
    return res.status(CREATED).json(user)
});

router.put("/:id",
    authenticateMiddleware('jwt', ['User']),
    async (req, res) => {
    const controller = new UserController();
    const user = await controller.updateUser(parseInt(req.params.id), req.body, req['user']);
    return res.status(OK).json(user)
});

router.delete("/:id",
    authenticateMiddleware('jwt', ['User']),
    async (req, res) => {
    const controller = new UserController();
    await controller.deleteUser(parseInt(req.params.id), req['user']);
    return res.status(OK)
});

export default router;