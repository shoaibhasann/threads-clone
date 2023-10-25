import { Router } from "express";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import {
  createPost,
  editPost,
  fetchFeed,
  getAllPosts,
  getPost,
  removePost,
} from "../controllers/post.controller.js";
import upload from "../middlewares/multer.middleware.js";

const router = Router();

router.get("/feed", isLoggedIn, fetchFeed);
router.post("/", isLoggedIn, upload.single("thumbnail"), createPost);
router.get("/", isLoggedIn, getAllPosts);
router.get("/:id", isLoggedIn, getPost);
router.put("/:id", isLoggedIn, editPost);
router.delete("/:id", isLoggedIn, removePost);



export default router;
