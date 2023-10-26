import { Router } from "express";
import { authorizedRoles, isLoggedIn } from "../middlewares/auth.middleware.js";
import { addComment, editComment, getAllComments, removeComment } from "../controllers/comment.controller.js";

const router = Router();

// Comment related routes
router.get("/all", isLoggedIn, authorizedRoles("ADMIN"), getAllComments);
router.post("/:postId", isLoggedIn, addComment);
router.put("/:commentId", isLoggedIn, editComment);
router.delete("/:postId/:commentId", isLoggedIn, removeComment);


export default router;