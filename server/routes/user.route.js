import { Router } from "express";
import { isLoggedIn, authorizedRoles } from "../middlewares/auth.middleware.js";
import { editProfile, followUser, getProfile, getUsers, unfollowUser } from "../controllers/user.controller.js";
import upload from "../middlewares/multer.middleware.js";

const router = Router();

router.get("/me", isLoggedIn, getProfile);
router.put("/edit-profile", isLoggedIn, upload.single("avatar"), editProfile);
router.get("/users/:userId/follow", isLoggedIn, followUser);
router.get("/users/:userId/unfollow", isLoggedIn, unfollowUser);
router.get("/admin", isLoggedIn, authorizedRoles("ADMIN"), getUsers);


export default router;