import express from "express";
import UserController from "../controller/users.controller.js";
import AuthMiddleware from "../middleware/auth.middleware.js";

const UserRouter = express.Router();

UserRouter.get("/data", AuthMiddleware.verifyToken, UserController.getUser);

export default UserRouter;