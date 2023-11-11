import { Router } from "express";
import {
  toggleReaction,
  getAllReactions,
  getPostReactions,
} from "../controller/reaction.controller.js";
import { authorizedRoles, isLoggedIn } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/all").get(isLoggedIn, authorizedRoles("ADMIN"), getAllReactions);

router
  .route("/:postId")
  .get(isLoggedIn, getPostReactions)
  .put(isLoggedIn, toggleReaction)


export default router;
