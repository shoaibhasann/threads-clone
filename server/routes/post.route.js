import { Router } from "express";
import { isLoggedIn } from "../middlewares/auth.middleware";
import { createPost, editPost, getAllPosts, getPost, removePost } from "../controllers/post.controller";

const router = Router();

router.post("/", isLoggedIn, createPost);
router.get("/", isLoggedIn, getAllPosts);
router.get("/:id", isLoggedIn, getPost);
router.put("/:id", isLoggedIn, editPost);
router.delete("/:id", isLoggedIn, removePost);

export default router;