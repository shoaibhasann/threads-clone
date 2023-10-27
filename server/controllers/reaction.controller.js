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
      path: "reactedBy",
      select: "username",
    },
  });

  if (!post) {
    return next(new AppError("Post not found", 404));
  }

  // Check if the user has already reacted to the post
  const existingReaction = post.reactions.find(
    (reaction) => reaction.reactedBy._id.toString() === userId.toString()
  );

  if (existingReaction) {
    await reactionModel.findByIdAndUpdate(existingReaction._id, {
      reaction: reactionType,
    });
  } else {
    // Create new reaction
    const newReaction = await reactionModel.create({
      reaction: reactionType,
      reactedBy: userId,
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
        path: "reactedBy",
        select: "username"
    }
  });

  if (!post) {
    return next(new AppError("Post not found", 404));
  }

  const existingReactionIndex = post.reactions.findIndex(
    (reaction) => reaction.reactedBy._id.toString() === userId.toString()
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
        path: "reactedBy",
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


/**
 * @GET_ALL_REACTIONS
 * @ROUTE @GET {{URL} /api/v1/reaction/all}
 * @ACCESS Admin
 */
const getAllReactions = asyncHandler(async (req, res, next) => {

  const reactions = await reactionModel.find();
  const reactionCount = await reactionModel.countDocuments();

  if (reactionCount.length === 0) {
    return next(new AppError("No reactions found.", 404));
  }

  res.status(200).json({
    success: true,
    message: "Reactions fetched successfully.",
    reactions,
    reactionCount
  });
});


export { addReaction, removeReaction, getPostReactions, getAllReactions };
