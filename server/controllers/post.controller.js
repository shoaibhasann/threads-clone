import postModel from "../models/post.model.js";
import userModel from "../models/user.model.js";
import commentModel from "../models/comment.model.js";
import asyncHandler from "../middlewares/asyncHandler.middleware.js";
import AppError from "../utils/error.util.js";
import fs from "fs/promises";
import cloudinary from "cloudinary";


/**
 *  @CREATE_POST
 *  @ROUTE @POST {{URL} /api/v1/posts/}
 *  @ACESS (Authenticated)
 */
const createPost = asyncHandler(async (req, res, next) => {

  const { title, description } = req.body;

  if (!title || !description) {
    return next(new AppError("title & description are required", 400));
  }

  const thumbnail = {};

  if (req.file) {

    try {
      const isImage = req.file.mimetype.startsWith('image');
      const setFolder = isImage ? "SpeakWave_Post_Images" : "SpeakWave_Posts_Videos";
      const resourceType = isImage ? 'image' : 'video';

      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: setFolder,
        resource_type: resourceType
      });

      if (result) {
        thumbnail.public_id = result.public_id;
        thumbnail.secure_url = result.secure_url;

        fs.rm(`uploads/${req.file.filename}`);
      }
    } catch (error) {
      return next(new AppError("Error while uploading thumbnail", 500));
    }
  }

  const post = await postModel.create({
    title,
    description,
    thumbnail,
    user: req.user.id
  });

  res.status(201).json({
    success: true,
    message: "Thank you for sharing your post.",
    post,
  });
});


/**
 * @GET_ALL_POST
 * @ROUTE @GET {{URL} /api/v1/posts/}
 * @ACCESS (Public)
 */
const getAllPosts = asyncHandler(async (req, res, next) => {
  const posts = await postModel.find().populate("user", "username avatar");

  if (posts.length === 0) {
    return next(new AppError("No posts found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Posts fetched successfully.",
    posts,
  });

});


/**
 *  @GET_POST_BY_ID
 *  @ROUTE @GET {{URL} /api/v1/posts/:id}
 *  @ACESS (Authenticated)
 */
const getPost = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  // Fetch post with comments info along the username and avatar and user which created post
    const post = await postModel
      .findById(id)
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: "username avatar",
        },
      })
      .populate("user", "username avatar");

    if (!post) {
      return next(new AppError("Post not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Post fetched successfully",
      post
    });
 
});


/**
 *  @EDIT_POST
 *  @ROUTE @PUT {{URL} /api/v1/posts/:id}
 *  @ACESS (Authenticated)
 */
const editPost = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { title, description } = req.body;

  const post = await postModel.findById(id);

  if (!post) {
    return next(new AppError("Post not found", 404));
  }

  if (title) {
    post.title = title;
  }

  if (description) {
    post.description = description;
  }

  if (req.file) {
    try {
      await cloudinary.v2.uploader.destroy(post.thumbnail.public_id);

      // Upload new thumbnail
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "SpeakWave_Posts",
      });

      if (result) {
        post.thumbnail.public_id = result.public_id;
        post.thumbnail.secure_url = result.secure_url;

        fs.rm(`uploads/${req.file.filename}`);
      }
    } catch (error) {
      return next(new AppError("Error while uploading post thumbnail", 500));
    }
  }

  await post.save();

  res.status(200).json({
    success: true,
    message: "Post updated successfully.",
    post,
  });
});

/**
 *  @DELETE_POST
 *  @ROUTE @DELETE {{URL} /api/v1/posts/:id}
 *  @ACESS (Authenticated)
 */
const removePost = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const postExists = await postModel.findById(id);

  if (!postExists) {
    return next(new AppError("Post not found", 404));
  }

  await cloudinary.v2.uploader.destroy(postExists.thumbnail.public_id);

  await postModel.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: "Post deleted successfully.",
  });
});


/**
 *  @ADD_COMMENT
 *  @ROUTE @POST {{URL} /api/v1/posts/:postId/comment}
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
      user: req.user.id, // Reference to the user
      text: comment,
    });

    // Check if the 'comments' property exists in the 'post' object
    if (!post.comments) {
      post.comments = [];
    }

    // Associate the comment with the post
    post.comments.push(newComment);

    // Save the updated post document
    await post.save();

    res.status(200).json({
      success: true,
      message: "Comment added successfully.",
      post,
    });
 
});


/**
 *  @EDIT_COMMENT
 *  @ROUTE @PUT /api/v1/posts/:commentId/comment
 *  @ACESS (Authenticated)
 */
const editComment = asyncHandler(async (req, res, next) => {
  const { commentId } = req.params;
  const { text } = req.body;

  if(!text){
    return next(new AppError("Comment text is required", 400));
  }

    // Find the comment by its ID
    const comment = await commentModel.findById(commentId);

    if (!comment) {
      return next(new AppError("Comment not found", 404));
    }

    // Check if the user making the request is the owner of the comment
    if (comment.user.toString() !== req.user.id) {
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
 *  @ROUTE @DELETE /api/v1/posts/:postId/comment/:commentId
 *  @ACESS (Authenticated)
 */
const removeComment = asyncHandler(async (req, res, next) => {
  const { postId, commentId } = req.params;

  const post = await postModel.findById(postId);

  if (!post) {
    return next(new AppError("Post not found", 404));
  }

  const comment = await commentModel.findById(commentId);

  console.log(comment);

  if(!comment){
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
  if (comment.user && comment.user.toString() !== req.user.id) {
    return next(new AppError("Permission denied", 403));
  }

  // Remove the comment
  post.comments.splice(commentIndex, 1); // Remove the comment at the specified index
  await post.save();

  // Remove comment from comment model
  await commentModel.findByIdAndDelete(commentId);

  res.status(200).json({
    success: true,
    message: "Comment deleted successfully.",
  });
});


/**
 *  @FETCH_FEED
 *  @ROUTE @GET /api/v1/posts/feed
 *  @ACESS (Authenticated)
 */
const fetchFeed = asyncHandler(async (req, res, next) => {
   const { id } = req.user;

   const user = await userModel.findById(id);

   if(!user){
    return next(new AppError("User not found", 404));
   }

   const followingUsers = user.following;

   if(followingUsers.length === 0){
    return next(new AppError("You aren't following anyone.", 400));
   }

   const posts = await postModel.find({ user: { $in: followingUsers}}).sort({ createdAt: -1 }).populate("user", "username avatar");

   if(posts.length === 0){
    return next(new AppError("Feed post not found", 404));
   }

   res.status(200).json({
    success: true,
    message: "Feed fetched successfully.",
    posts
   });
});



export {
  createPost,
  getPost,
  editPost,
  removePost,
  getAllPosts,
  addComment,
  editComment,
  removeComment,
  fetchFeed
};
