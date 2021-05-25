import express from "express";
import UserController from "../controller/UserController";
import StatusCodes from 'http-status-codes';

const { CREATED, OK} = StatusCodes;

const router = express.Router();

router.get("/:id", async (req, res) => {
    const controller = new  UserController();
    const user = await controller.getUser(parseInt(req.params.id));
    return res.status(OK).json(user)
});

router.post("/register", async (req, res) => {
    const controller = new UserController();
    const user = await controller.registerUser(req.body);
    return res.status(CREATED).json(user)
});

router.put("/:id", async (req, res) => {
    const controller = new UserController();
    const user = await controller.updateUser(parseInt(req.params.id), req.body);
    return res.status(OK).json(user)
});

router.delete("/:id", async (req, res) => {
    const controller = new UserController();
    await controller.deleteUser(parseInt(req.params.id));
    return res.status(OK)
});

export default router;