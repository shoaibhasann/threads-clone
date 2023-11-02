import postModel from "../model/post.model.js";
import userModel from "../model/user.model.js";
import asyncHandler from "../middleware/asyncHandler.middleware.js";
import AppError from "../util/error.util.js";
import fs from "fs/promises";
import cloudinary from "cloudinary";

/**
 *  @CREATE_POST
 *  @ROUTE @POST {{URL} /api/v1/posts/}
 *  @ACESS (Authenticated)
 */
const createPost = asyncHandler(async (req, res, next) => {
  const { content } = req.body;

  if (!content) {
    return next(new AppError("Content is required", 400));
  }

  const thumbnail = {};

  if (req.file) {
    try {
      const isImage = req.file.mimetype.startsWith("image");
      const setFolder = isImage
        ? "SpeakWave_Post_Images"
        : "SpeakWave_Posts_Videos";
      const resourceType = isImage ? "image" : "video";

      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: setFolder,
        resource_type: resourceType,
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
    content,
    thumbnail,
    postedBy: req.user.id,
  });

  res.status(201).json({
    success: true,
    message: "Thank you for sharing your post.",
    post,
  });
});

/**
 * @GET_ALL_POSTS
 * @ROUTE @GET {{URL} /api/v1/posts/}
 * @ACCESS (Public)
 */
const fetchPosts = asyncHandler(async (req, res, next) => {
  const posts = await postModel
    .find()
    .populate({
      path: "comments",
      populate: {
        path: "commentedBy",
        select: "username avatar",
      },
    })
    .populate("postedBy", "username avatar");

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
const fetchPostById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  // Fetch post with comments info along the username and avatar and user which created post
  const post = await postModel
    .findById(id)
    .populate({
      path: "comments",
      populate: {
        path: "commentedBy",
        select: "username avatar",
      },
    })
    .populate({
      path: "reactions",
      populate: {
        path: "reactedBy",
        select: "username avatar",
      },
    })
    .populate("postedBy", "username avatar");

  if (!post) {
    return next(new AppError("Post not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Post fetched successfully",
    post,
  });
});

/**
 *  @EDIT_POST
 *  @ROUTE @PUT {{URL} /api/v1/posts/:id}
 *  @ACESS (Authenticated)
 */
const editPost = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { content } = req.body;

  const post = await postModel.findById(id);

  if (!post) {
    return next(new AppError("Post not found", 404));
  }

  if (content) {
    post.content = content;
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

  const repostDocuments = await userModel.find({
    repost: postExists._id,
  });

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
 *  @REPOST_POST
 *  @ROUTE @GET {{URL} /api/v1/posts/repost/:id}
 *  @ACESS (Authenticated)
 */
const repostPost = asyncHandler(async (req, res, next) => {
  const { id: userId } = req.user;

  const { id } = req.params;

  const user = await userModel.findById(userId);

  const post = await postModel.findById(id);

  if (!user || !post) {
    return next(new AppError("User or post not found", 404));
  }

  if (userId.toString() === post.postedBy.toString()) {
    return next(new AppError("You can't repost your post", 400));
  }

  user.repost.push(post);
  await user.save();

  post.numberOfRepost = post.numberOfRepost + 1;

  await post.save();

  res.status(201).json({
    success: true,
    message: "Post reposted successfully",
  });
});

/**
 *  @Fetch_REPOST
 *  @ROUTE @GET {{URL} /api/v1/posts/fetch-repost}
 *  @ACESS (Authenticated)
 */
const fetchRepost = asyncHandler(async (req, res, next) => {
  const { id: userId } = req.user;

  const reposts = await userModel.findById(userId).populate({
    path: "repost",
    populate: {
      path: "postedBy",
      select: "username avatar",
    },
  });

  if (!reposts) {
    return next(new AppError("You haven't reposted yet", 404));
  }

  res.status(200).json({
    success: true,
    message: "Reposts fetched successfully",
    reposts: reposts.repost,
  });
});

/**
 *  @FETCH_FOLLOWING_FEED
 *  @ROUTE @GET /api/v1/posts/following-feed
 *  @ACESS (Authenticated)
 */
const fetchFollowingFeed = asyncHandler(async (req, res, next) => {
  const { id } = req.user;

  const user = await userModel.findById(id);

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  const followingUsers = user.following;

  if (followingUsers.length === 0) {
    return next(new AppError("You aren't following anyone.", 400));
  }

  const followingFeed = await postModel
    .find({ postedBy: { $in: followingUsers } })
    .sort({ createdAt: -1 })
    .populate("postedBy", "username avatar");

  if (followingFeed.length === 0) {
    return next(new AppError("Feed post not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Feed fetched successfully.",
    followingFeed,
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

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  const followingUsers = user.following;
  const userInterests = user.interests;

  let query = {
    postedBy: { $nin: [...followingUsers, id] },
  };

  if (userInterests.length > 0) {
    query.interests = { $in: userInterests };
  }

  const feed = await postModel
    .find(query)
    .sort({ createdAt: -1 })
    .populate("postedBy", "username avatar");

  if (feed.length === 0) {
    return next(new AppError("Feed not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Feed fetched successfully",
    feed,
  });
});

export {
  createPost,
  fetchPosts,
  fetchPostById,
  editPost,
  removePost,
  repostPost,
  fetchRepost,
  fetchFollowingFeed,
  fetchFeed,
};
