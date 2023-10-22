import { Router } from "express";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import { getProfile } from "../controllers/user.controller.js";

const router = Router();

router.get("/me", isLoggedIn, getProfile);

export default router;