import postModel from "../models/post.model.js";
import asyncHandler from "../middlewares/asyncHandler.middleware.js";
import AppError from "../utils/error.util.js";
import fs from "fs/promises";
import cloudinary from "cloudinary";

/**
 *  @CREATE_POST
 *  @ROUTE @POST {{URL} /api/v1/posts/}
 *  @ACESS (Public)
 */
const createPost = asyncHandler(async (req, res, next) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return next(new AppError("title & description are required", 400));
  }

  const thumbnail = {};

  if (req.file) {
    try {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "SpeakWave_Posts",
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
  });

  res.status(201).json({
    success: true,
    message: "Thank you for sharing your post.",
    post,
  });
});

/**
 *  @GET_ALL_POST
 *  @ROUTE @GET {{URL} /api/v1/posts/}
 *  @ACESS (Public)
 */
const getAllPosts = asyncHandler(async (req, res, next) => {
    const posts = await postModel.find();

    if(!posts){
        return next(new AppError("No posts found", 404));
    }

    res.status(200).json({
        success: true,
        message: "Posts fetched successfully.",
        posts
    });
})

/**
 *  @READ_POST
 *  @ROUTE @GET {{URL} /api/v1/posts/:id}
 *  @ACESS (Public)
 */
const getPost = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const postExists = await postModel.findById(id);

  if (!postExists) {
    return next(new AppError("Post not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Post fetched successfully",
    post: postExists,
  });
});

/**
 *  @EDIT_POST
 *  @ROUTE @PUT {{URL} /api/v1/posts/:id}
 *  @ACESS (Public)
 */
const editPost = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { title, description } = req.body;

  const postExists = await postModel.findById(id);

  if (!postExists) {
    return next(new AppError("Post not found", 404));
  }

  if (title) {
    postExists.title = title;
  }

  if (description) {
    postExists.description = description;
  }

  if (req.file) {
    try {
      await cloudinary.v2.uploader.destroy(postExists.thumbnail.public_id);

      // Upload new thumbnail
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "SpeakWave_Posts",
      });

      if (result) {
        postExists.thumbnail.public_id = result.public_id;
        postExists.thumbnail.secure_url = result.secure_url;

        fs.rm(`uploads/${req.file.filename}`);
      }
    } catch (error) {
      return next(new AppError("Error while uploading post thumbnail", 500));
    }
  }

  await postExists.save();

  res.status(200).json({
    success: true,
    message: "Post updated successfully.",
    post,
  });
});

/**
 *  @DELETE_POST
 *  @ROUTE @DELETE {{URL} /api/v1/posts/:id}
 *  @ACESS (Public)
 */
const removePost = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const postExists = await postModel.findById(id);

  if (!postExists) {
    return next(new AppError("Post not found", 404));
  }

  await postModel.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: "Post deleted successfully.",
  });
});

export { createPost, getPost, editPost, removePost, getAllPosts };
