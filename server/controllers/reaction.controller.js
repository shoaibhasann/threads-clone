import asyncHandler from "../middlewares/asyncHandler.middleware.js";
import postModel from "../models/post.model.js";
import reactionModel from "../models/reaction.model.js";
import AppError from "../utils/error.util.js";

/**
 *  @ADD_REACTION
 *  @ROUTE @POST {{URL} /api/v1/reaction/:postId}
 *  @ACESS (Authenticated)
 */
const addReaction = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;
  const { id: userId } = req.user;
  const { reactionType } = req.body;

  // Find the post and populate its reactions with user details
  const post = await postModel.findById(postId).populate({
    path: "reactions",
    populate: {
      path: "user",
      select: "username",
    },
  });

  if (!post) {
    return next(new AppError("Post not found", 404));
  }

  // Check if the user has already reacted to the post
  const existingReaction = post.reactions.find(
    (reaction) => reaction.user._id.toString() === userId.toString()
  );

  if (existingReaction) {
    await reactionModel.findByIdAndUpdate(existingReaction._id, {
      reaction: reactionType,
    });
  } else {
    // Create new reaction
    const newReaction = await reactionModel.create({
      reaction: reactionType,
      user: userId,
    });

    post.reactions.push(newReaction);

    post.numberOfReactions = post.reactions.length;
  }

  await post.save();

  res.status(201).json({
    success: true,
    message: "Reaction added successfully",
    data: {
      reactionType: reactionType,
    },
  });
});

/**
 * @REMOVE_REACTION
 * @ROUTE @DELETE {{URL} /api/v1/reaction/:postId}
 * @ACCESS Authenticated
 */
const removeReaction = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;
  const { id: userId } = req.user;

  const post = await postModel.findById(postId).populate({
    path: "reactions",
    populate: {
        path: "user",
        select: "username"
    }
  });

  if (!post) {
    return next(new AppError("Post not found", 404));
  }

  const existingReactionIndex = post.reactions.findIndex(
    (reaction) => reaction.user._id.toString() === userId.toString()
  );

  if (existingReactionIndex === -1) {
    return next(new AppError("Reaction not found for this post", 400));
  }

  const removedReactionId = post.reactions[existingReactionIndex]._id;

  post.reactions.splice(existingReactionIndex, 1);

  post.numberOfReactions = post.reactions.length;

  await post.save();

  await reactionModel.findByIdAndDelete(removedReactionId);

  res.status(200).json({
    success: true,
    message: "Reaction removed successfully",
  });
});

/**
 * @GET_POST_REACTIONS
 * @ROUTE @GET {{URL} /api/v1/reaction/:postId}
 * @ACCESS Authenticated
 */
const getPostReactions = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;

  const post = await postModel
    .findById(postId)
    .populate({
      path: "reactions",
      populate: {
        path: "user",
        select: "username avatar",
      },
    })
    .sort({ createdAt: -1 });

  if (!post) {
    return next(new AppError(`Post not found with this ID: ${postId}`, 404));
  }

  res.status(200).json({
    success: true,
    message: "Post reactions fetched successfully.",
    post,
  });
});

export { addReaction, removeReaction, getPostReactions };
