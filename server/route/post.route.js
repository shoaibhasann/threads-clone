import { Router } from "express";
import { isLoggedIn } from "../middleware/auth.middleware.js";
import {
  createPost,
  editPost,
  fetchFollowingFeed,
  fetchRepost,
  getAllPosts,
  getPost,
  removePost,
  repostPost,
} from "../controller/post.controller.js";
import upload from "../middleware/multer.middleware.js";

const router = Router();

router.get("/feed", isLoggedIn, fetchFollowingFeed);
router.get("/repost/:id", isLoggedIn, repostPost);
router.get("/fetch-repost", isLoggedIn, fetchRepost);
router.get("/", isLoggedIn, getAllPosts);
router.get("/:id", isLoggedIn, getPost);
router.post("/", isLoggedIn, upload.single("thumbnail"), createPost);
router.put("/:id", isLoggedIn, editPost);
router.delete("/:id", isLoggedIn, removePost);


export default router;
