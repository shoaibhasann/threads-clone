import userModel from "../model/user.model.js";
import asyncHandler from "../middleware/asyncHandler.middleware.js";
import AppError from "../util/error.util.js";
import cloudinary from "cloudinary";
import fs from "fs/promises";

/**
 *  @EDIT_PROFILE
 *  @ROUTE @POST {{URL} /api/v1/me}
 *  @ACESS (Public)
 */
const getProfile = asyncHandler(async (req, res, next) => {
  const { id } = req.user;

  const user = await userModel.findById(id);

  if (!user) {
    return next(new AppError("User not found", 400));
  }

  res.status(200).json({
    success: true,
    message: "Profile fetched successfully!",
    user,
  });
});

/**
 *  @EDIT_PROFILE
 *  @ROUTE @PUT {{URL} /api/v1/edit-profile}
 *  @ACESS (Public)
 */
const editProfile = asyncHandler(async (req, res, next) => {
  const { id } = req.user;
  
  const { fullname, username, email, interests, bio } = req.body;

  if (email) {
    return next(new AppError("Email change are not allowed", 400));
  }

  const user = await userModel.findById(id);

  if (!user) {
    return next(new AppError("User not found.", 400));
  }

  if (fullname) {
    user.fullname = fullname;
  }

  if (username) {
    const usernameExists = await userModel.findOne({ username });

    if (usernameExists) {
      return next(new AppError("Username already taken", 400));
    }

    user.username = username;
  }

  if (interests) {
    user.interests = interests;
  }

  if(bio){
    user.bio = bio;
  }

  if (req.file) {
    try {
      // Delete old avatar image from cloudinary
      await cloudinary.v2.uploader.destroy(user.avatar.public_id);

      // Upload new avatar
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "SpeakWave_Users",
        width: 250,
        height: 250,
        gravity: "faces",
        crop: "fill",
      });

      if (result) {
        user.avatar.public_id = result.public_id;
        user.avatar.secure_url = result.secure_url;

        // Remove file from uploads folder
        fs.rm(`uploads/${req.file.filename}`);
      }
    } catch (error) {
      return next(new AppError("Error while uploading file", 500));
    }
  }

  // finally saving updated user details
  await user.save();

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user,
  });
});

/**
 *  @FOLLOW_USER
 *  @ROUTE @GET {{URL} /api/v1/users/:userId/follow}
 *  @ACESS (Public)
 */
const followUser = asyncHandler(async (req, res, next) => {
  const { userId } = req.params; // User ID of the user to follow

  const { id } = req.user;

  if (id.toString() === userId.toString()) {
    return next(new AppError("Soory, you can't follow ownself", 400));
  }

  const currentUser = await userModel.findById(id);

  // Check if the user to follow exists
  const userToFollow = await userModel.findById(userId);

  if (!userToFollow) {
    return next(new AppError("User not found", 404));
  }

  if (currentUser.following.includes(userId)) {
    return next(new AppError("You already following this user"));
  }

  // Add the user in following's array of the current user
  currentUser.following.push(userId);
  await currentUser.save();

  // Add the current user in the followers's array of the user to follow
  userToFollow.follower.push(currentUser._id);

  await userToFollow.save();

  res.status(200).json({
    success: true,
    message: `You'are now following ${userToFollow.username}`,
  });
});

/**
 *  @UNFOLLOW_USER
 *  @ROUTE @GET {{URL} /api/v1/users/:userId/unfollow}
 *  @ACESS (Public)
 */
const unfollowUser = asyncHandler(async (req, res, next) => {
  const { userId } = req.params; //User ID to unfollow

  const { id } = req.user;

  if (id.toString() === userId.toString()) {
    return next(new AppError("Soory, you can't follow ownself", 400));
  }

  const currentUser = await userModel.findById(id);

  // Check if the user to unfollow exists
  const userToUnfollow = await userModel.findById(userId);

  if (!userToUnfollow) {
    return next(new AppError("User not found", 404));
  }

  if (!currentUser.following.includes(userId)) {
    return next(new AppError("You aren't following this user", 400));
  }

  // Remove the user from the following's array of current user
  currentUser.following = currentUser.following.filter(
    (id) => id.toString() !== userId.toString()
  );
  await currentUser.save();

  // Remove the current user from the followers's array of user to unfollow
  userToUnfollow.follower = userToUnfollow.follower.filter(
    (followerId) => followerId.toString() !== currentUser._id.toString()
  );
  await userToUnfollow.save();

  res.status(200).json({
    success: true,
    message: `You unfollow ${userToUnfollow.username}`,
  });
});


/**
 *  @GET_UNFOLLOWED_FOLLOWERS
 *  @ROUTE @GET {{URL} /api/v1/unfollowed-followers}
 *  @ACESS (Public)
 */
const getUnfollowedFollowers = asyncHandler(async (req, res, next) => {
  const { id } = req.user;

  // Find current user's followers
  const currentUser = await userModel
    .findById(id)
    .populate("follower", "username avatar");

  if (!currentUser) {
    return next(new AppError("User not found", 404));
  }

  const followers = currentUser.follower;
  const userNotFollowedBack = [];

  for (const follower of followers) {
    const isFollowedBack = currentUser.following.includes(follower._id);

    if (!isFollowedBack) {
      userNotFollowedBack.push(follower);
    }
  }

  res.status(200).json({
    success: true,
    message: "People you didn't follow back",
    userNotFollowedBack,
  });
});


/**
 *  @GET_ALL_USER
 *  @ROUTE @GET {{URL} /api/v1/admin}
 *  @ACESS (Admin)
 */
const getUsers = asyncHandler(async (req, res, next) => {
  const users = await userModel.find();

  res.status(200).json({
    success: true,
    message: "Users fetched successfully.",
    users,
  });
});

export {
  getProfile,
  editProfile,
  followUser,
  unfollowUser,
  getUnfollowedFollowers,
  getUsers,
};
