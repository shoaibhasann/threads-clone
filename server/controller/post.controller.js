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

  if(!content && !req.file){
    return next(new AppError("Please add something before posting", 400));
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

  if(postExists.thumbnail && postExists.thumbnail.public_id){
    await cloudinary.v2.uploader.destroy(postExists.thumbnail.public_id);
  }

  const isDeleted = await postModel.findByIdAndDelete(id);

  if(isDeleted){
    // updating user's reposted post
    await userModel.updateMany(
      { repost: id },
      { $pull: { repost: id }}
    )
  }

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

  if(user.repost.includes(id)){
    return next(new AppError("You can't repost the thread more than one time.", 400));
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
 *  @FETCH_REPOST
 *  @ROUTE @GET {{URL} /api/v1/posts/fetch-repost/:userId}
 *  @ACESS (Authenticated)
 */
const fetchRepost = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;

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

  const feed = await postModel
    .find()
    .sort({ createdAt: -1 })
    .populate("postedBy", "username avatar")

  if (feed.length === 0) {
    return next(new AppError("Feed not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Feed fetched successfully",
    feed,
  });
});



/**
 *  @TOGGLE_LIKE
 *  @ROUTE @PUT {{URL} /api/v1/posts/like-unlike/:postId}
 *  @ACESS (Authenticated)
 */
const toggleLikeUnlike = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;
  const { id: userId } = req.user;

  // Find the post and populate its reactions with user details
  const post = await postModel.findById(postId);

  if (!post) {
    return next(new AppError("Post not found", 404));
  }

  // Check if the user has already liked the post
  const existingLikeIndex = post.likes.findIndex(
    (like) => like.toString() === userId.toString()
  );

  try {
    if (existingLikeIndex !== -1) {
      // Remove like from post
      post.likes.splice(existingLikeIndex, 1);
    } else {
      // Add like to post
      post.likes.push(userId);
    }

    await post.save(); // Save once after toggling

    res.status(201).json({
      success: true,
      message: "Reaction toggled successfully",
    });
  } catch (error) {
    return next(new AppError("Error saving post", 500));
  }
});


/**
 *  @ADD_COMMENT
 *  @ROUTE @POST {{URL} /api/v1/posts/reply/:postId}
 *  @ACESS (Authenticated)
 */
const addComment = asyncHandler(async (req, res, next) => {
  const { id } = req.user;
  const { postId } = req.params;
  const { comment } = req.body;

  const user = await userModel.findById(id);

    if (!user) {
      return next(new AppError("User not found", 404));
    }

  const post = await postModel.findById(postId);

  if(!post){
    return next(new AppError("Post not found", 404));
  }

  // Create new reply or comment 
  const newReply = {
    userId: id,
    text: comment,
    userAvatar: user.avatar.secure_url,
    username: user.username,
    repliedAt: Date.now()
  }

  post.replies.push(newReply);

  await post.save();

  res.status(201).json({
    success: true,
    message: "Replied successfully",
    newReply
  });

});


/**
 *  @REMOVE_COMMENT
 *  @ROUTE @POST {{URL} /api/v1/posts/comment/:postId/:commentId}
 *  @ACESS (Authenticated)
 */
const removeComment = asyncHandler(async (req, res, next) => {
  const { postId, commentId } = req.params;

  if(!commentId){
    return next(new AppError("Something went wrong, please try again later", 400));
  }


  const post = await postModel.findById(postId);

  if (!post) {
    return next(new AppError("Post not found"), 404);
  }

  // Use toString() to ensure a consistent comparison
  const commentIndex = post.replies.findIndex(
    (reply) => reply._id.toString() === commentId.toString()
  );

  if (commentIndex !== -1) {
    post.replies.splice(commentIndex, 1);
    await post.save();

    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  }

  return next(new AppError("Comment not found"), 404);
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
  toggleLikeUnlike,
  addComment,
  removeComment
};
