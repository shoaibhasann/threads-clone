import { Router } from "express";
import { isLoggedIn } from "../middleware/auth.middleware.js";
import {
  createPost,
  editPost,
  fetchFollowingFeed,
  getAllPosts,
  getPost,
  removePost,
} from "../controller/post.controller.js";
import upload from "../middleware/multer.middleware.js";

const router = Router();

router.get("/feed", isLoggedIn, fetchFollowingFeed);
router.post("/", isLoggedIn, upload.single("thumbnail"), createPost);
router.get("/", isLoggedIn, getAllPosts);
router.get("/:id", isLoggedIn, getPost);
router.put("/:id", isLoggedIn, editPost);
router.delete("/:id", isLoggedIn, removePost);



export default router;
