import { Router } from "express";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import { addComment, editComment, removeComment } from "../controllers/comment.controller.js";

const router = Router();

// Comment related routes
router.post("/:postId", isLoggedIn, addComment);
router.put("/:commentId", isLoggedIn, editComment);
router.delete("/:postId/:commentId", isLoggedIn, removeComment);


export default router;