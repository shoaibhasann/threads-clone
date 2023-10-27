import { Router } from "express";
import { changePassword, forgotPassword, login, logout, register, resetPassword } from "../controller/auth.controller.js";
import { isLoggedIn } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:resetToken", resetPassword);
router.get("/logout", isLoggedIn, logout);
router.put("/change-password", isLoggedIn, changePassword);

export default router;