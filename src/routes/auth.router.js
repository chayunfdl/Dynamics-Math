import express from "express";
import AuthController from "../controller/auth.controller.js";
import AuthMiddleware from "../middleware/auth.middleware.js";

const AuthRouter = express.Router();

AuthRouter.post('/', AuthMiddleware.verifyUser, (req, res) => res.end())
AuthRouter.post('/register', AuthController.Register);
AuthRouter.post("/login", AuthController.Login);
AuthRouter.delete("/logout", AuthController.Logout);

export default AuthRouter;