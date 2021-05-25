import express from "express";
import StatusCodes from 'http-status-codes';
import AdminController from "../controller/AdminController";

const { CREATED, OK} = StatusCodes;

const router = express.Router();

router.get("/:id", async (req, res) => {
    const controller = new  AdminController();
    const user = await controller.getAdmin(parseInt(req.params.id));
    return res.status(OK).json(user)
});

router.post("/register", async (req, res) => {
    const controller = new AdminController();
    const user = await controller.registerAdmin(req.body);
    return res.status(CREATED).json(user)
});

router.put("/:id", async (req, res) => {
    const controller = new AdminController();
    const user = await controller.updateAdmin(parseInt(req.params.id), req.body);
    return res.status(OK).json(user)
});

router.delete("/:id", async (req, res) => {
    const controller = new AdminController();
    await controller.deleteAdmin(parseInt(req.params.id));
    return res.status(OK)
});

export default router;