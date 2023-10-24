import { Router } from "express";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import {
  addComment,
  createPost,
  editComment,
  editPost,
  fetchFeed,
  getAllPosts,
  getPost,
  removeComment,
  removePost,
} from "../controllers/post.controller.js";
import upload from "../middlewares/multer.middleware.js";

const router = Router();

router.get("/feed", isLoggedIn, fetchFeed);

// Post related routes
router.post("/", isLoggedIn, upload.single("thumbnail"), createPost);
router.get("/", isLoggedIn, getAllPosts);
router.get("/:id", isLoggedIn, getPost);
router.put("/:id", isLoggedIn, editPost);
router.delete("/:id", isLoggedIn, removePost);

// Comment related routes
router.post("/:postId/comment", isLoggedIn, addComment);
router.put("/:commentId/comment", isLoggedIn, editComment);
router.delete("/:postId/comment/:commentId", isLoggedIn, removeComment);


export default router;
