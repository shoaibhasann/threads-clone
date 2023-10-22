import { Router } from "express";
import upload from "../middlewares/multer.middleware.js";
import { login, logout, register } from "../controllers/auth.controller.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/auth/register", register);
router.post("/auth/login", login);
router.get("/auth/logout", isLoggedIn, logout);

export default router;