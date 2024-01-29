import { Router } from "express";
import { authorizedRoles, isLoggedIn } from "../middleware/auth.middleware.js";
import {
  addComment,
  createPost,
  editPost,
  fetchFeed,
  fetchFollowingFeed,
  fetchPostById,
  fetchPosts,
  fetchRepost,
  removePost,
  repostPost,
  toggleLikeUnlike,
  removeComment
} from "../controller/post.controller.js";
import upload from "../middleware/multer.middleware.js";

const router = Router();

router.get("/following-feed", isLoggedIn, fetchFollowingFeed);
router.get("/feed", isLoggedIn, fetchFeed);
router.get("/repost/:id", isLoggedIn, repostPost);
router.get("/fetch-repost/:userId", isLoggedIn, fetchRepost);
router.get("/", isLoggedIn, fetchPosts);
router.get("/:id", isLoggedIn, fetchPostById);
router.post("/", isLoggedIn, upload.single("thumbnail"), createPost);
router.post("/reply/:postId", isLoggedIn, addComment);
router.put("/:id", isLoggedIn, upload.single("thumbnail"), editPost);
router.put("/like-unlike/:postId", isLoggedIn, toggleLikeUnlike);
router.delete("/:id", isLoggedIn, removePost);
router.delete("/comment/:postId/:commentId", isLoggedIn, removeComment);



export default router;
