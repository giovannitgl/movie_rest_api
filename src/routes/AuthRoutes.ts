import express from "express";
import StatusCodes from 'http-status-codes';
import AuthController from "../controller/AuthController";

const {OK} = StatusCodes;

const router = express.Router();

router.post("/", async (req, res) => {
    const controller = new  AuthController();
    const user = await controller.authenticate(req.body);
    return res.status(OK).json(user)
});

export default router;