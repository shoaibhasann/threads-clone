import { Router } from "express";
import { addReaction, getPostReactions, removeReaction } from "../controllers/reaction.controller.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/:postId")
 .get(isLoggedIn, getPostReactions)
 .post(isLoggedIn, addReaction)
 .delete(isLoggedIn, removeReaction);


 export default router;