import { Router } from "express";
import { authorizedRoles, isLoggedIn } from "../middleware/auth.middleware.js";
import {
  createPost,
  editPost,
  fetchFeed,
  fetchFollowingFeed,
  fetchPostById,
  fetchPosts,
  fetchRepost,
  removePost,
  repostPost,
} from "../controller/post.controller.js";
import upload from "../middleware/multer.middleware.js";

const router = Router();

router.get("/following-feed", isLoggedIn, fetchFollowingFeed);
router.get("/feed", isLoggedIn, fetchFeed);
router.get("/repost/:id", isLoggedIn, repostPost);
router.get("/fetch-repost", isLoggedIn, fetchRepost);
router.get("/", isLoggedIn, fetchPosts);
router.get("/:id", isLoggedIn, fetchPostById);
router.post("/", isLoggedIn, upload.single("thumbnail"), createPost);
router.put("/:id", isLoggedIn, editPost);
router.delete("/:id", isLoggedIn, removePost);


export default router;
