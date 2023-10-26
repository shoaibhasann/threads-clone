import { Router } from "express";
import { addReaction, getAllReactions, getPostReactions, removeReaction } from "../controllers/reaction.controller.js";
import { authorizedRoles, isLoggedIn } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/all").get(isLoggedIn, authorizedRoles("ADMIN"), getAllReactions);

router.route("/:postId")
 .get(isLoggedIn, getPostReactions)
 .post(isLoggedIn, addReaction)
 .delete(isLoggedIn, removeReaction);


 export default router;