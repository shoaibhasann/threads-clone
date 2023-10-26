import postModel from "../models/post.model.js";
import userModel from "../models/user.model.js";
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
  const posts = await postModel.find()
  .populate("user", "username avatar").populate({
    path: "comments",
    populate: {
      path: "user",
      select: "username avatar"
    }
  }).populate({
    path: "reactions",
    populate: {
      path: "user",
      select: "username avatar"
    }
  });

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
      .populate({
        path: "reactions",
        populate: {
          path: "user",
          select: "username avatar"
        }
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
  fetchFeed
};
