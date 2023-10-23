import { Router } from "express";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import { editProfile, followUser, getProfile, unfollowUser } from "../controllers/user.controller.js";
import upload from "../middlewares/multer.middleware.js";

const router = Router();

router.get("/me", isLoggedIn, getProfile);
router.put("/edit-profile", isLoggedIn, upload.single("avatar"), editProfile);
router.post("/users/:userId/follow", isLoggedIn, followUser);
router.post("/users/:userId/unfollow", isLoggedIn, unfollowUser);


export default router;