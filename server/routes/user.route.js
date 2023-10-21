import { Router } from "express";
import upload from "../middlewares/multer.middleware.js";
import { getProfile, login, logout, register } from "../controllers/user.controller.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/auth/register", register);
router.post("/auth/login", login);
router.get("/auth/logout", logout);
router.get("/me", isLoggedIn, getProfile);



export default router;