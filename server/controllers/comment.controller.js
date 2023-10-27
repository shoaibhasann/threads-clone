import postModel from "../models/post.model.js";
import commentModel from "../models/comment.model.js";
import asyncHandler from "../middlewares/asyncHandler.middleware.js";
import AppError from "../utils/error.util.js";

/**
 *  @ADD_COMMENT
 *  @ROUTE @POST {{URL} /api/v1/comment/:postId}
 *  @ACESS (Authenticated)
 */
const addComment = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;
  const { comment } = req.body;

  // Find the post by its ID
  const post = await postModel.findById(postId);

  if (!post) {
    return next(new AppError("Post not found", 404));
  }

  // Create a new comment document
  const newComment = await commentModel.create({
    commentedBy: req.user.id, // Reference to the user
    text: comment,
  });

  if (!post.comments) {
    post.comments = [];
  }

  post.comments.push(newComment);

  post.numberOfComments = post.comments.length;

  await post.save();

  res.status(200).json({
    success: true,
    message: "Comment added successfully.",
    post,
  });
});

/**
 *  @EDIT_COMMENT
 *  @ROUTE @PUT /api/v1/comment/:commentId
 *  @ACESS (Authenticated)
 */
const editComment = asyncHandler(async (req, res, next) => {
  
  const { commentId } = req.params;
  const { text } = req.body;

  if (!text) {
    return next(new AppError("Comment text is required", 400));
  }

  // Find the comment by its ID
  const comment = await commentModel.findById(commentId);

  if (!comment) {
    return next(new AppError("Comment not found", 404));
  }

  // Check if the user making the request is the owner of the comment
  if (comment.commentedBy.toString() !== req.user.id) {
    return next(new AppError("Permission denied", 403));
  }

  // Update the comment text
  comment.text = text;

  await comment.save();

  res.status(200).json({
    success: true,
    message: "Comment updated successfully",
    comment,
  });
});

/**
 *  @DELETE_COMMENT
 *  @ROUTE @DELETE /api/v1/comment/:postId/:commentId
 *  @ACESS (Authenticated)
 */
const removeComment = asyncHandler(async (req, res, next) => {
  const { postId, commentId } = req.params;

  const post = await postModel.findById(postId);

  if (!post) {
    return next(new AppError("Post not found", 404));
  }

  const comment = await commentModel.findById(commentId);

  if (!comment) {
    return next(new AppError("Comment not found", 404));
  }

  // Find the index of the specific comment by its ID
  const commentIndex = post.comments.findIndex(
    (element) => element._id.toString() === commentId
  );

  if (commentIndex === -1) {
    return next(new AppError("Comment not found", 404));
  }

  // Check if the comment exists and if the user making the request is the owner of the comment
  if (comment.commentedBy && comment.commentedBy.toString() !== req.user.id) {
    return next(new AppError("Permission denied", 403));
  }

  // Remove the comment
  post.comments.splice(commentIndex, 1); // Remove the comment at the specified index

  post.numberOfComments = post.comments.length;
  
  await post.save();

  // Remove comment from comment model
  await commentModel.findByIdAndDelete(commentId);

  res.status(200).json({
    success: true,
    message: "Comment deleted successfully.",
  });
});


/**
 * @GET_ALL_COMMENTS
 * @ROUTE @GET {{URL} /api/v1/comment/all}
 * @ACCESS Admin
 */
const getAllComments = asyncHandler(async (req, res, next) => {

  const comments = await commentModel.find();
  const commentCount = await commentModel.countDocuments();

  if (commentCount.length === 0) {
    return next(new AppError("No comments found.", 404));
  }

  res.status(200).json({
    success: true,
    message: "Comments fetched successfully.",
    comments,
    commentCount
  });
});


export { addComment, editComment, removeComment, getAllComments };