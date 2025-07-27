import { Router } from "express";
import { signup, login } from "../controllers/authController";

const authRouter = Router();

// POST /auth/signup
authRouter.post("/api/auth/signup", signup);

// POST /auth/login
authRouter.post("/api/auth/login", login);

export default authRouter;
