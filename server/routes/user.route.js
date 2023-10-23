import { Router } from "express";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import { editProfile, getProfile } from "../controllers/user.controller.js";

const router = Router();

router.get("/me", isLoggedIn, getProfile);
router.put("/edit-profile", isLoggedIn, editProfile);

export default router;